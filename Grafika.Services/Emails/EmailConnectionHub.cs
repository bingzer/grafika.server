using System;
using System.Threading.Tasks;
using Grafika.Connections;
using Grafika.Configurations;
using MailKit;
using Microsoft.Extensions.Options;

namespace Grafika.Services.Emails
{
    class EmailConnectionHub : ConnectionHub, IEmailConnectionHub
    {
        private readonly EmailConfiguration _emailConfig;
        private readonly IMailTransport _mailer;

        public EmailConnectionHub(IOptions<EmailConfiguration> emailOpts, IMailTransport mailer) 
            : base("Email")
        {
            _emailConfig = emailOpts.Value;
            _mailer = mailer;
        }

        public override async Task CheckStatus()
        {
            await _mailer.ConnectAsync(_emailConfig.Host, _emailConfig.Port);
            await _mailer.AuthenticateAsync(_emailConfig.Username, _emailConfig.Password);
            if (!_mailer.IsConnected)
                throw new Exception("Unable to connect");
            if (!_mailer.IsAuthenticated)
                throw new Exception("Unable to authenticate");
        }

        public override void Dispose()
        {
            _mailer.Disconnect(true);
        }
    }
}
