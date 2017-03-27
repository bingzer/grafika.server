using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAccountEmailService : IEmailService
    {
        Task SendAccountVerificationEmail(User user);
        Task SendAccountPasswordResetEmail(User user);
    }
}
