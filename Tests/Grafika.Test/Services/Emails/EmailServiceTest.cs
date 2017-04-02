using Grafika.Configurations;
using Grafika.Emails;
using Grafika.Services.Emails;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;
using System.Threading.Tasks;
using Moq;
using MailKit;
using MimeKit;
using System.Threading;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using MailKit.Security;

namespace Grafika.Test.Services.Emails
{
    public class EmailServiceTest
    {
        [Fact]
        public async void TestSendEmail_Null()
        {
            var emailOpts = MockHelpers.Configure<EmailConfiguration>();

            var mockServiceProvider = MockHelpers.ServiceProvider;
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IOptions<EmailConfiguration>))))
                .Returns(emailOpts.Object)
                .Verifiable();

            var mockServiceContext = MockHelpers.ServiceContext;
            mockServiceContext.Setup(c => c.ServiceProvider)
                .Returns(mockServiceProvider.Object)
                .Verifiable();

            var emailService = new EmailService(mockServiceContext.Object);
            await Assert.ThrowsAsync<ArgumentNullException>(() => emailService.SendEmail(null));
        }

        [Theory]
        [InlineData("system@email.com", "system-default@email.com", "system@email.com")]
        [InlineData(null, "system-default@email.com", "system-default@email.com")]
        public async void TestSendEmail(string from, string defaultFrom, string fromExpected)
        {
            var emailData = new TestingEmailData
            {
                To = "to@email.com",
                Subject = "subject",
                From = from
            };

            var emailOpts = MockHelpers.Configure<EmailConfiguration>();
            emailOpts.Object.Value.DefaultFrom = defaultFrom;
            emailOpts.Object.Value.Username = "username";
            emailOpts.Object.Value.Password = "password";
            emailOpts.Object.Value.Host = "host";
            emailOpts.Object.Value.Port = 22;

            var mockMailTransport = new Mock<IMailTransport>();
            mockMailTransport.Setup(c => c.SendAsync(It.Is<MimeMessage>(
                m => ((MailboxAddress)m.To[0]).Address == "to@email.com" &&
                    m.Subject == "subject" &&
                    ((MailboxAddress)m.From[0]).Address == fromExpected
            ), It.IsAny<CancellationToken>(), It.IsAny<ITransferProgress>()))
                .Returns(Task.FromResult(0))
                .Verifiable();
            mockMailTransport.Setup(c => c.AuthenticateAsync(
                It.Is<string>(str => str == emailOpts.Object.Value.Username),
                It.Is<string>(str => str == emailOpts.Object.Value.Password),
                It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(0))
                .Verifiable();
            mockMailTransport.Setup(c => c.ConnectAsync(
                It.Is<string>(str => str == emailOpts.Object.Value.Host),
                It.Is<int>(i => i == emailOpts.Object.Value.Port),
                It.IsAny<SecureSocketOptions>(),
                It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(0))
                .Verifiable();

            var mockServiceProvider = MockHelpers.ServiceProvider;
            mockServiceProvider.Reset();
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IMailTransport))))
                .Returns(mockMailTransport.Object)
                .Verifiable();
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IOptions<EmailConfiguration>))))
                .Returns(emailOpts.Object)
                .Verifiable();

            var mockServiceContext = MockHelpers.ServiceContext;
            mockServiceContext.Setup(c => c.ServiceProvider)
                .Returns(mockServiceProvider.Object)
                .Verifiable();

            var emailService = new EmailService(mockServiceContext.Object);
            await emailService.SendEmail(emailData);

            Assert.Equal(emailData.From, fromExpected);

            mockMailTransport.VerifyAll();
            mockServiceProvider.VerifyAll();
            mockServiceContext.VerifyAll();
        }

        class TestingEmailData : EmailData
        {
            public override Task<string> GetContent(string type = "text/html")
            {
                return Task.FromResult(type);
            }
        }
    }

}
