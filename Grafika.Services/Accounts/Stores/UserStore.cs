using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Grafika.Services.Accounts.Stores
{
    partial class AccountStore : IUserStore<User>
    {
        public Task<User> FindByIdAsync(string userId, CancellationToken cancellationToken) => FindById(userId);

        public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id);
        }

        public Task<User> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken) => FindByEmailAsync(normalizedUserName, cancellationToken);
        public Task<string> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken) => GetNormalizedEmailAsync(user, cancellationToken);
        public Task<string> GetUserNameAsync(User user, CancellationToken cancellationToken) => GetEmailAsync(user, cancellationToken);
        public Task SetNormalizedUserNameAsync(User user, string normalizedName, CancellationToken cancellationToken) => SetNormalizedEmailAsync(user, normalizedName, cancellationToken);
        public Task SetUserNameAsync(User user, string userName, CancellationToken cancellationToken) => SetEmailAsync(user, userName, cancellationToken);


        public async Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            await UpdatePartial(user);
            return IdentityResult.Success;
        }
        public Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken) => throw new NotImplementedException();

        public async Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
        {
            var existingUser = await FindByEmailAsync(user.Email, cancellationToken);
            if (existingUser != null)
                throw new NotValidException("You already have an account: " + user.Email);

            var now = DateTimeOffset.UtcNow;
            var username = AccountsUtils.GenerateUsername();

            Func<bool> IsExternalLogin = () => (user.Google != null || user.Facebook != null);

            var newUser = new User
            {
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateCreated = now.ToUnixTimeMilliseconds(),
                DateModified = now.ToUnixTimeMilliseconds(),
                Activation = user.Activation,
                IsActive = user.IsActive,
                Prefs = AccountsUtils.NewUserPreference(username, _contentConfig),
                Roles = new List<string> { Roles.User },
                Stats = AccountsUtils.NewUserStats(now),
                Subscriptions = AccountsUtils.NewUserSubscriptions(),
                Local = user.Local,
                Google = user.Google,
                Facebook = user.Facebook,
            };

            var registeredUser = await Add(newUser);

            await SetEmailConfirmedAsync(registeredUser, registeredUser.IsActive.Value, cancellationToken);

            return IdentityResult.Success;
        }
    }
}
