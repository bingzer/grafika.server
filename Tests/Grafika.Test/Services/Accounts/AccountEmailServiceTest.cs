using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Accounts;
using MailKit;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services.Accounts
{
    public class AccountEmailServiceTest
    {
        [Fact]
        public async void SendAccountPasswordResetEmailTest()
        {
            var user = new User { Email = "user@email.com", Activation = new UserActivation { Hash = "sdf" } };
            var emailConfiguration = new EmailConfiguration { DefaultFrom = "from@email.com" };
            var serverConfig = new ServerConfiguration();

            var mockMailTransport = new Mock<IMailTransport>();
            var mockTemplateEngine = new Mock<ITemplatedRenderingEngine<string>>();
            var mockServiceContext = MockHelpers.ServiceContext;
            var mockServiceProvider = MockHelpers.ServiceProvider;
            var mockUserRepository = new Mock<IUserRepository>();

            mockServiceContext.Setup(c => c.ServiceProvider).Returns(mockServiceProvider.Object);
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IMailTransport)))).Returns(mockMailTransport.Object);
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(ITemplatedRenderingEngine<string>)))).Returns(mockTemplateEngine.Object);
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IOptions<EmailConfiguration>)))).Returns(new OptionsWrapper<EmailConfiguration>(emailConfiguration));
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IOptions<ServerConfiguration>)))).Returns(new OptionsWrapper<ServerConfiguration>(serverConfig));
            mockUserRepository.Setup(c => c.First(It.IsAny<UserQueryOptions>())).Returns(Task.FromResult(user));

            var service = new AccountEmailService(mockServiceContext.Object, mockUserRepository.Object);
            await service.SendAccountPasswordResetEmail(user);

            mockMailTransport.Verify(c => c.ConnectAsync(It.IsAny<string>(), It.IsAny<int>(),It.IsAny<SecureSocketOptions>(), It.IsAny<CancellationToken>()));
            mockMailTransport.Verify(c => c.AuthenticateAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()));
            mockMailTransport.Verify(c => c.SendAsync(
                It.Is<MimeMessage>(m => 
                    ((MailboxAddress)m.To[0]).Address == "user@email.com" &&
                    ((MailboxAddress)m.From[0]).Address == "from@email.com"),
                It.IsAny<CancellationToken>(), 
                It.IsAny<ITransferProgress>()));
        }

        [Fact]
        public async void SendAccountVerificationEmailTest()
        {
            var user = new User { Email = "user@email.com", Activation = new UserActivation { Hash = "sdf" } };
            var emailConfiguration = new EmailConfiguration { DefaultFrom = "from@email.com" };
            var serverConfig = new ServerConfiguration();

            var mockMailTransport = new Mock<IMailTransport>();
            var mockTemplateEngine = new Mock<ITemplatedRenderingEngine<string>>();
            var mockServiceContext = MockHelpers.ServiceContext;
            var mockServiceProvider = MockHelpers.ServiceProvider;
            var mockUserRepository = new Mock<IUserRepository>();

            mockServiceContext.Setup(c => c.ServiceProvider).Returns(mockServiceProvider.Object);
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IMailTransport)))).Returns(mockMailTransport.Object);
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(ITemplatedRenderingEngine<string>)))).Returns(mockTemplateEngine.Object);
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IOptions<EmailConfiguration>)))).Returns(new OptionsWrapper<EmailConfiguration>(emailConfiguration));
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IOptions<ServerConfiguration>)))).Returns(new OptionsWrapper<ServerConfiguration>(serverConfig));
            mockUserRepository.Setup(c => c.First(It.IsAny<UserQueryOptions>())).Returns(Task.FromResult(user));

            var service = new AccountEmailService(mockServiceContext.Object, mockUserRepository.Object);
            await service.SendAccountVerificationEmail(user);

            mockMailTransport.Verify(c => c.ConnectAsync(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<SecureSocketOptions>(), It.IsAny<CancellationToken>()));
            mockMailTransport.Verify(c => c.AuthenticateAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()));
            mockMailTransport.Verify(c => c.SendAsync(
                It.Is<MimeMessage>(m =>
                    ((MailboxAddress)m.To[0]).Address == "user@email.com" &&
                    ((MailboxAddress)m.From[0]).Address == "from@email.com"),
                It.IsAny<CancellationToken>(),
                It.IsAny<ITransferProgress>()));
        }
    }
}
