using Grafika.Emails;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IEmailService : IService
    {
        Task SendEmail(IEmailData data);
    }
}
