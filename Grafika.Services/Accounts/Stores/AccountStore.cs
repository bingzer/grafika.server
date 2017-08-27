using Grafika.Configurations;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Grafika.Services.Accounts.Stores
{
    internal partial class AccountStore : IAccountStore
    {
        private readonly IUserRepository _userRepository;
        private readonly ServerConfiguration _serverConfiguration;
        private readonly EmailConfiguration _emailConfig;

        public AccountStore(
            IUserRepository userRepo,
            IOptions<ServerConfiguration> serverOpts,
            IOptions<EmailConfiguration> mailOpts)
        {
            _userRepository = userRepo;
            _serverConfiguration = serverOpts.Value;
            _emailConfig = mailOpts.Value;
        }

        protected Task<User> Add(User user)
        {
            return _userRepository.Add(user);
        }

        protected Task<User> FindById(string id)
        {
            return _userRepository.First(new UserQueryOptions { Id = id });
        }

        protected Task<User> FindByEmail(string email)
        {
            return _userRepository.First(new UserQueryOptions { Email = email });
        }

        protected Task UpdatePartial(User update)
        {
            return _userRepository.Update(update);
        }

        public void Dispose()
        {
            _userRepository.Dispose();
        }
    }
}
