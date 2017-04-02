using System.Threading.Tasks;
using Grafika.Emails;
using Microsoft.Extensions.Options;
using Grafika.Configurations;
using MailKit.Net.Smtp;
using MimeKit;
using Grafika.Utilities;
using MailKit;
using System;

namespace Grafika.Services.Emails
{
    public class EmailService : Service, IEmailService, IDisposable
    {
        public EmailConfiguration EmailConfig { get; private set; }
        public IMailTransport Mailer { get; private set; }

        public EmailService(IServiceContext userContext) 
            : base(userContext)
        {
            EmailConfig = Context.ServiceProvider.Get<IOptions<EmailConfiguration>>().Value;
            Mailer = Context.ServiceProvider.Get<IMailTransport>();
            // if not provided use the default one
            if (Mailer == null)
                Mailer = new SmtpClient();
        }

        public async Task SendEmail(IEmailData data)
        {
            Ensure.ArgumentNotNull(data, "data");

            if (data.From == null)
                data.From = EmailConfig.DefaultFrom;

            var mimeMessage = await data.GenerateMimeMessage();
            await Send(mimeMessage);
        }


        private async Task Send(MimeMessage message)
        {
            await Mailer.ConnectAsync(EmailConfig.Host, EmailConfig.Port);
            await Mailer.AuthenticateAsync(EmailConfig.Username, EmailConfig.Password);
            await Mailer.SendAsync(message);
        }

        public void Dispose()
        {
            Mailer.Dispose();
        }
    }
}
