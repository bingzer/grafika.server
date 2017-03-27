using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Utilities;

namespace Grafika.Services.Admins
{
    public class AdminService : Service, IAdminService
    {
        private readonly IAccountService _accountService;
        private readonly IAnimationRepository _animationRepository;
        private readonly IUserRepository _userRepository;

        public AdminService(IServiceContext serviceContext,
            IAccountService accountService,
            IAnimationRepository animationRepository,
            IUserRepository userRepository) 
            : base(serviceContext)
        {
            _accountService = accountService;
            _animationRepository = animationRepository;
            _userRepository = userRepository;
        }

        public async Task ActivateUser(string userId)
        {
            if (!await _userRepository.Any(new UserQueryOptions { Id = userId }))
                throw new NotFoundExeption();
            
            var update = new User(userId)
            {
                IsActive = true,
                Activation = new UserActivation()
            };

            await _userRepository.Update(update);
        }

        public async Task InactivateUser(string userId)
        {
            if (!await _userRepository.Any(new UserQueryOptions { Id = userId }))
                throw new NotFoundExeption();

            var update = new User(userId)
            {
                IsActive = false,
                Activation = new UserActivation()
            };

            await _userRepository.Update(update);
        }

        public Task<IEnumerable<Animation>> GetAnimations(AnimationQueryOptions options)
        {
            return _animationRepository.Find(options);
        }

        public Task<ServerInfo> GetServerInfo()
        {
            var env = Context.ServiceProvider.Get<AppEnvironment>();
            return Task.FromResult<ServerInfo>(env);
        }

        public Task<IEnumerable<User>> GetUsers(UserQueryOptions options)
        {
            return _userRepository.Find(options);
        }

        public async Task ResetUserPassword(string userId)
        {
            var user = await _userRepository.First(new UserQueryOptions { Id = userId });
            if (user == null)
                throw new NotFoundExeption();

            await _accountService.RequestPasswordReset(user.Email);
        }

        public async Task ReverifyUser(string userId)
        {
            var user = await _userRepository.First(new UserQueryOptions { Id = userId });
            if (user == null)
                throw new NotFoundExeption();

            await _accountService.RequestUserActivation(user.Email);
        }
    }
}
