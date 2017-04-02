using Grafika.Configurations;
using Grafika.Services.Emails;
using Grafika.Services.Models;
using Grafika.Utilities;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Grafika.Services.Accounts
{
    class AccountEmailService : TemplatedEmailService, IAccountEmailService
    {
        private readonly IUserRepository _userRepository;

        public AccountEmailService(IServiceContext userContext, IUserRepository userRepository) 
            : base(userContext)
        {
            _userRepository = userRepository;
        }

        public async Task SendAccountPasswordResetEmail(User user)
        {
            user = await _userRepository.First(new UserQueryOptions { Email = user.Email });
            if (user == null)
                throw new NotFoundExeption();

            var model = CreateModel<AccountPasswordResetEmail>(user.Email, "Grafika: Password Reset");
            model.Link = Utility.CombineUrl(ContentConfig.Url, $"r?action=reset-pwd&hash={Utility.UrlEncode(user.Activation.Hash)}&user={Utility.UrlEncode(user.Email)}");

            await SendEmail(model);
        }

        public async Task SendAccountVerificationEmail(User user)
        {
            user = await _userRepository.First(new UserQueryOptions { Email = user.Email });
            if (user == null)
                throw new NotFoundExeption();

            var model = CreateModel<AccountVerificationEmail>(user.Email, "Grafika: Please verify your email");
            model.Link = Utility.CombineUrl(ContentConfig.Url, $"r?action=verify&hash={Utility.UrlEncode(user.Activation.Hash)}&user={Utility.UrlEncode(user.Email)}");

            await SendEmail(model);
        }
    }
}
