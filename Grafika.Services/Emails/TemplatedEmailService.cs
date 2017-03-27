using Grafika.Configurations;
using Grafika.Emails;
using Grafika.Services.Models;
using Grafika.Utilities;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Grafika.Services.Emails
{
    class TemplatedEmailService : EmailService
    {
        public ContentConfiguration ContentConfig { get; private set; }
        public ITemplatedRenderingEngine<string> Engine { get; private set; }

        public TemplatedEmailService(IServiceContext userContext) 
            : base(userContext)
        {
            ContentConfig = Context.ServiceProvider.Get<IOptions<ContentConfiguration>>().Value;
            Engine = Context.ServiceProvider.Get<ITemplatedRenderingEngine<string>>();
        }

        protected TEmailModel CreateModel<TEmailModel>(string to, string subject)
            where TEmailModel : BaseEmailModel, new()
        {
            return new TEmailModel
            {
                Email = to,
                HomeUrl = ContentConfig.Url,
                PrivacyUrl = Utility.CombineUrl(ContentConfig.Url, ContentConfig.PrivacyPath),
                Sender = EmailConfig.DefaultFrom,
                Subject = subject
            };
        }

        protected IEmailData CreateEmailData<TEmailModel>(TEmailModel model)
            where TEmailModel : BaseEmailModel, new()
        {
            var templateName = typeof(TEmailModel).Name;
            return new TemplatedEmailData<TEmailModel>(Engine, templateName, model)
            {
                To = model.Email,
                Subject = model.Subject
            };
        }

        protected Task SendEmail<TEmailModel>(TEmailModel model)
            where TEmailModel : BaseEmailModel, new()
        {
            var emailData = CreateEmailData(model);
            return base.SendEmail(emailData);
        }
    }
}
