
using Grafika.Services.Accounts.Tokens;
using Grafika.Utilities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace Grafika.Services.Accounts
{
    internal partial class AccountService : Service, IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly IAccountEmailService _emailService;
        private readonly IUserRepository _userRepository;
        private readonly ITokenExchangeStrategyFactory _tokenFactory;

        public AccountService(IServiceContext serviceContext, 
            IUserRepository userRepository,
            IAccountEmailService emailService,
            ITokenExchangeStrategyFactory tokenFactory,
            UserManager<User> manager) 
            : base(serviceContext)
        {
            _emailService = emailService;
            _userRepository = userRepository;
            _userManager = manager;
            _tokenFactory = tokenFactory;
        }

        public async Task<AuthenticationToken> Login(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                throw new NotFoundExeption();

            if (user.IsActive == true)
            {
                user.Activation = new UserActivation(); // do not provide hash
                var result = await _userManager.CheckPasswordAsync(user, password);
                if (result)
                {
                    await UpdateLastSeen(user);
                    return await GenerateUserToken(user);
                }
            }

            throw new NotAuthorizedException();
        }

        public async Task<AuthenticationToken> Login(IUserIdentity userIdentity)
        {
            var user = await _userManager.FindByEmailAsync(userIdentity.Email);
            if (user == null)
            {
                user = await Register(userIdentity);
            }

            // update third-party id if any
            if (userIdentity.AuthenticationType == OAuthProvider.Google.GetName())
                await _userRepository.Update(new User(user.Id) { Google = new UserOAuth { DisplayName = userIdentity.Name, Id = userIdentity.Id } });
            else if (userIdentity.AuthenticationType == OAuthProvider.Facebook.GetName())
                await  _userRepository.Update(new User(user.Id) { Facebook = new UserOAuth { DisplayName = userIdentity.Name, Id = userIdentity.Id } });

            var token = await GenerateUserToken(user);
            await UpdateLastSeen(user);

            return token;
        }

        public async Task<User> Register(string email, string firstName, string lastName)
        {
            // Creating for the first time
            var user = new User
            {
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                IsActive = false,
                Username = AccountsUtils.GenerateUsername(),
                Local = new UserLocal { IsRegistered = true },
            };

            var result = await _userManager.CreateAsync(user);
            result.ThrowIfFailed();

            await RequestUserActivation(user.Email);

            return await _userManager.FindByEmailAsync(user.Email);
        }

        public async Task<User> Register(IUserIdentity providerIdentity)
        {
            var user = await _userManager.FindByEmailAsync(providerIdentity.Email);
            if (user == null)
            {
                user = new User(providerIdentity) { Id = null, IsActive = true };
                user.Username = AccountsUtils.GenerateUsername();

                if (providerIdentity.AuthenticationType == OAuthProvider.Google.GetName())
                    user.Google = new UserOAuth { DisplayName = providerIdentity.Name, Id = providerIdentity.Id };
                else if (providerIdentity.AuthenticationType == OAuthProvider.Facebook.GetName())
                    user.Facebook = new UserOAuth { DisplayName = providerIdentity.Name, Id = providerIdentity.Id };
                else throw new NotSupportedException("provider : " + providerIdentity.AuthenticationType);

                var result = await _userManager.CreateAsync(user);
                result.ThrowIfFailed();

                return await _userManager.FindByEmailAsync(user.Email);
            }
            else throw new NotValidException("User exists " + providerIdentity.Email);
        }

        public async Task ConfirmActivation(string email, string hash, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                throw new NotFoundExeption();

            IdentityResult result;
            if (await _userManager.HasPasswordAsync(user))
            {
                if (!await _userManager.VerifyUserTokenAsync(user, AccountTokenProvider.ProviderKey, AccountTokenProvider.PurposeResetPassword, hash))
                    throw new NotValidException("User/Link requested is not valid");
                result = await _userManager.ResetPasswordAsync(user, hash, password);
                result.ThrowIfFailed();
            }
            else
            {
                if (!await _userManager.VerifyUserTokenAsync(user, AccountTokenProvider.ProviderKey, AccountTokenProvider.PurposeEmailConfirmation, hash))
                    throw new NotValidException("User/Link requested is not valid");
                result = await _userManager.AddPasswordAsync(user, password);
                result.ThrowIfFailed();
            }
        }

        public async Task ChangePassword(string email, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                throw new NotFoundExeption();

            IdentityResult result;
            if (!await _userManager.HasPasswordAsync(user))
                result = await _userManager.AddPasswordAsync(user, newPassword);
            else
                result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);

            result.ThrowIfFailed();
        }

        public async Task RequestPasswordReset(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                throw new NotFoundExeption();

            if (user.Activation != null && user.Activation.Hash != null && !user.Activation.IsExpired(TimeSpan.FromMinutes(5)))
                throw new NotValidException("Reset email has already been sent. To resend please redo the step in 5 minutes");
            else
            {
                var update = new User(user.Id)
                {
                    Activation = new UserActivation
                    {
                        Hash = await _userManager.GeneratePasswordResetTokenAsync(user),
                        Timestamp = DateTime.UtcNow
                    }
                };
                await _userRepository.Update(update);
                await _emailService.SendAccountPasswordResetEmail(user);
            }
        }

        public async Task RequestUserActivation(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                throw new NotFoundExeption();

            var update = new User(user.Id)
            {
                Activation = new UserActivation
                {
                    Hash = await _userManager.GenerateEmailConfirmationTokenAsync(user),
                    Timestamp = DateTime.UtcNow
                }
            };
            await _userRepository.Update(update);
            await _emailService.SendAccountVerificationEmail(user);
        }

        public async Task CheckUsernameAvailability(string email, string username)
        {
            var userRequested = await _userManager.FindByEmailAsync(email);
            await _userRepository.CheckUsernameAvailability(userRequested, username);
        }

        public async Task<AuthenticationToken> GenerateUserToken(User user)
        {
            return new AuthenticationToken
            {
                Id = user.Id,
                Token = await _userManager.GenerateUserTokenAsync(user, AccountTokenProvider.ProviderKey, "Authentication")
            };
        }

        public Task<IUserIdentity> Exchange(OAuthProvider authProvider, AuthenticationToken token)
        {
            var strategy = _tokenFactory.GetStrategy(Context.ServiceProvider, authProvider);
            return strategy.ExchangeToken(token.Token);
        }

        public async Task Detach(IUser user, OAuthProvider authProvider)
        {
            var update = new User(user.Id);
            switch (authProvider)
            {
                case OAuthProvider.Google:
                    update.Google = new UserOAuth();
                    await _userRepository.Update(update);
                    break;
                case OAuthProvider.Facebook:
                    update.Facebook = new UserOAuth();
                    await _userRepository.Update(update);
                    break;
            }
        }

        #region Private Supporting Methods

        private Task UpdateLastSeen(User user)
        {
            var update = new User(user.Id) { Stats = new UserStats { DateLastSeen = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() } };
            return _userRepository.Update(update);
        }

        #endregion

    }
}
