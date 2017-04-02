using System.Threading.Tasks;
using Grafika.Emails;
using Grafika.Services.Models;

namespace Grafika.Services.Emails
{
    public interface ITemplatedEmailService
    {
        //IEmailData CreateEmailData<TEmailModel>(TEmailModel model) where TEmailModel : BaseEmailModel, new();

        TEmailModel CreateModel<TEmailModel>(string to, string subject) 
            where TEmailModel : BaseEmailModel, new();

        Task SendEmail<TEmailModel>(TEmailModel model) 
            where TEmailModel : BaseEmailModel, new();
    }
}