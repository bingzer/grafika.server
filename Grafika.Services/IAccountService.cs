using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAccountService : IService
    {
        Task<AuthenticationToken> Login(string username, string password);
        Task<AuthenticationToken> Login(IUserIdentity providerIdentity);
        Task<AuthenticationToken> GenerateUserToken(User user);

        Task<IUserIdentity> Exchange(OAuthProvider authProvider, AuthenticationToken token);
        Task Detach(IUser user, OAuthProvider authProvider);

        Task<User> Register(string email, string firstName, string lastName);
        Task<User> Register(IUserIdentity providerIdentity);

        Task ConfirmActivation(string email, string hash, string password);
        Task CheckUsernameAvailability(string email, string username);

        Task ChangePassword(string email, string currentPassword, string newPassword);
        Task RequestPasswordReset(string email);
        Task RequestUserActivation(string email);
    }
}
