using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Animations;
using MailKit;
using Microsoft.Extensions.Options;
using MimeKit;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services.Animations
{
    public class AnimationEmailServiceTest
    {
        ContentConfiguration contentConfiguration = new ContentConfiguration();
        EmailConfiguration emailConfiguration = new EmailConfiguration { DefaultFrom = "system@email.com" };

        Mock<IMailTransport> mockMailTransport = new Mock<IMailTransport>();
        Mock<IOptions<EmailConfiguration>> mockEmailOptions = new Mock<IOptions<EmailConfiguration>>();
        Mock<IOptions<ContentConfiguration>> mockContentOptions = new Mock<IOptions<ContentConfiguration>>();
        Mock<ITemplatedRenderingEngine<string>> mockTemplatedEngine = new Mock<ITemplatedRenderingEngine<string>>();

        [Fact]
        public async void TestSendAnimationCommentEmail_NoAnimationOrUserFound()
        {
            var mockAnimService = new Mock<IAnimationService>();
            mockAnimService.Setup(c => c.Get(It.IsAny<string>()))
                .ReturnsAsync((Animation)null)
                .Verifiable();
            var mockUserRepo = new Mock<IUserRepository>();

            // -- animation not found
            var service = SetupAnimationEmailService(mockAnimService.Object, mockUserRepo.Object);
            await Assert.ThrowsAsync<NotFoundExeption>(() => service.SendAnimationCommentEmail("animationId", new Comment { Id = "Id", Text = "Text" }));

            mockAnimService.VerifyAll();
            mockUserRepo.VerifyAll();

            // -- user not found
            mockAnimService.Reset();
            mockAnimService.Setup(c => c.Get(It.IsAny<string>()))
                .ReturnsAsync(new Animation())
                .Verifiable();
            mockUserRepo.Setup(c => c.First(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync((User)null)
                .Verifiable();
            await Assert.ThrowsAsync<NotFoundExeption>(() => service.SendAnimationCommentEmail("animationId", new Comment { Id = "Id", Text = "Text" }));

            mockAnimService.VerifyAll();
            mockUserRepo.VerifyAll();
        }

        [Fact]
        public async void TestSendAnimationCommentEmail_UserNotSubscribed()
        {
            var mockAnimService = new Mock<IAnimationService>();
            mockAnimService.Setup(c => c.Get(It.IsAny<string>()))
                .ReturnsAsync(new Animation())
                .Verifiable();
            var mockUserRepo = new Mock<IUserRepository>();
            mockUserRepo.Setup(c => c.First(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(new User { Subscriptions = new UserSubscriptions { EmailOnComments = false } })
                .Verifiable();

            var service = SetupAnimationEmailService(mockAnimService.Object, mockUserRepo.Object);
            await service.SendAnimationCommentEmail("animationId", new Comment { Id = "Id", Text = "Text" });

            mockAnimService.VerifyAll();
            mockUserRepo.VerifyAll();
            mockMailTransport.VerifyAll();
        }

        [Fact]
        public async void TestSendAnimationCommentEmail()
        {
            var mockAnimService = new Mock<IAnimationService>();
            mockAnimService.Setup(c => c.Get(It.IsAny<string>()))
                .ReturnsAsync(new Animation())
                .Verifiable();
            var mockUserRepo = new Mock<IUserRepository>();
            mockUserRepo.Setup(c => c.First(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(new User { Subscriptions = new UserSubscriptions { EmailOnComments = true }, Email = "user@email.com" })
                .Verifiable();
            var mockAwsRepo = new Mock<IAwsResourceRepository>();
            mockAwsRepo.Setup(c => c.GetResourceUrl(It.Is<string>(str => str == "animationId"), It.Is<string>(str => str == Thumbnail.ResourceId)))
                .ReturnsAsync("resource-url")
                .Verifiable();

            mockMailTransport.Setup(c => c.SendAsync(It.IsAny<MimeMessage>(), It.IsAny<CancellationToken>(), It.IsAny<ITransferProgress>()))
                .Returns(Task.FromResult(0))
                .Verifiable();

            var service = SetupAnimationEmailService(mockAnimService.Object, mockUserRepo.Object, mockAwsRepo.Object);
            await service.SendAnimationCommentEmail("animationId", new Comment { Id = "Id", Text = "Text" });

            mockAnimService.VerifyAll();
            mockUserRepo.VerifyAll();
            mockMailTransport.VerifyAll();
            mockAwsRepo.VerifyAll();
        }

        private AnimationEmailService SetupAnimationEmailService(
            IAnimationService animService = null,
            IUserRepository userRepo = null,
            IAwsResourceRepository awsRepo = null)
        {

            var mockServiceProvider = MockHelpers.ServiceProvider;
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IMailTransport))))
                .Returns(mockMailTransport.Object);
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IOptions<EmailConfiguration>))))
                .Returns(() => new OptionsWrapper<EmailConfiguration>(emailConfiguration));
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IOptions<ContentConfiguration>))))
                .Returns(() => new OptionsWrapper<ContentConfiguration>(contentConfiguration));
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(ITemplatedRenderingEngine<string>))))
                .Returns(mockTemplatedEngine.Object);

            var mockServiceContext = MockHelpers.ServiceContext;
            mockServiceContext.Setup(c => c.ServiceProvider)
                .Returns(mockServiceProvider.Object);

            return new AnimationEmailService(mockServiceContext.Object, animService, userRepo, awsRepo);
        }

        private class Comment : IComment
        {
            public string Id { get; set; }
            public string Text { get; set; }
        }
    }
}
