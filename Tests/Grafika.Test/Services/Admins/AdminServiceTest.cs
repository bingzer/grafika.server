using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Admins;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services.Admins
{
    public class AdminServiceTest
    {
        [Fact]
        public async void TestGetAnimations()
        {
            var mockAnimationRepository = new Mock<IAnimationRepository>();
            mockAnimationRepository
                .Setup(c => c.Find(It.IsAny<AnimationQueryOptions>()))
                .ReturnsAsync(new List<Animation>())
                .Verifiable();

            var service = new AdminService(MockHelpers.ServiceContext.Object, null, mockAnimationRepository.Object, null);
            await service.GetAnimations(new AnimationQueryOptions());

            mockAnimationRepository.VerifyAll();
        }

        [Fact]
        public async void TestGetServerInfo()
        {
            var mockServiceProvider = MockHelpers.ServiceProvider;
            var mockServiceContext = MockHelpers.ServiceContext;
            mockServiceContext.Setup(c => c.ServiceProvider)
                .Returns(mockServiceProvider.Object)
                .Verifiable();

            var service = new AdminService(mockServiceContext.Object, null, null, null);
            await service.GetServerInfo();

            mockServiceProvider.Verify(c => c.GetService(It.Is<Type>(t => t == typeof(AppEnvironment))));
            mockServiceContext.VerifyAll();
        }

        [Fact]
        public async void TestGetUsers()
        {
            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository
                .Setup(c => c.Find(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(new List<User>())
                .Verifiable();

            var service = new AdminService(MockHelpers.ServiceContext.Object, null, null, mockUserRepository.Object);
            await service.GetUsers(new UserQueryOptions());

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void TestInactivateUser()
        {
            var user = new User("userId");

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository
                .Setup(c => c.Any(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(true)
                .Verifiable();
            mockUserRepository
                .Setup(c => c.Update(It.Is<User>(
                    u => u.Id == "userId" && u.IsActive == false && u.Activation.Hash == null && u.Activation.Timestamp == null
                )))
                .ReturnsAsync(new User())
                .Verifiable();

            var service = new AdminService(MockHelpers.ServiceContext.Object, null, null, mockUserRepository.Object);
            await service.InactivateUser("userId");

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void TestInactivateUser_NotFound()
        {
            var user = new User("userId");

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository
                .Setup(c => c.Any(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(false)
                .Verifiable();

            var service = new AdminService(MockHelpers.ServiceContext.Object, null, null, mockUserRepository.Object);
            await Assert.ThrowsAsync<Grafika.NotFoundExeption>(() => service.InactivateUser("userId"));

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void TestActivateUser()
        {
            var user = new User("userId");

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository
                .Setup(c => c.Any(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(true)
                .Verifiable();
            mockUserRepository
                .Setup(c => c.Update(It.Is<User>(
                    u => u.Id == "userId" && u.IsActive == true && u.Activation.Hash == null && u.Activation.Timestamp == null
                )))
                .ReturnsAsync(new User())
                .Verifiable();

            var service = new AdminService(MockHelpers.ServiceContext.Object, null, null, mockUserRepository.Object);
            await service.ActivateUser("userId");

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void TestActivateUser_NotFound()
        {
            var user = new User("userId");

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository
                .Setup(c => c.Any(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(false)
                .Verifiable();

            var service = new AdminService(MockHelpers.ServiceContext.Object, null, null, mockUserRepository.Object);
            await Assert.ThrowsAsync<Grafika.NotFoundExeption>(() => service.ActivateUser("userId"));

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void TestResetUserPassword()
        {
            var user = new User("userId") { Email = "user@email.com" };

            var mockEmailService = new Mock<IAccountService>();
            mockEmailService.Setup(c => c.RequestPasswordReset(It.Is<string>(str => str == "user@email.com")))
                .Returns(Task.FromResult(0))
                .Verifiable();

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository
                .Setup(c => c.First(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(user)
                .Verifiable();

            var service = new AdminService(MockHelpers.ServiceContext.Object, mockEmailService.Object, null, mockUserRepository.Object);
            await service.ResetUserPassword("userId");

            mockUserRepository.VerifyAll();
            mockEmailService.VerifyAll();
        }

        [Fact]
        public async void TestReverifyUser()
        {
            var user = new User("userId") { Email = "user@email.com" };

            var mockEmailService = new Mock<IAccountService>();
            mockEmailService.Setup(c => c.RequestUserActivation(It.Is<string>(str => str == "user@email.com")))
                .Returns(Task.FromResult(0))
                .Verifiable();

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository
                .Setup(c => c.First(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(user)
                .Verifiable();

            var service = new AdminService(MockHelpers.ServiceContext.Object, mockEmailService.Object, null, mockUserRepository.Object);
            await service.ReverifyUser("userId");

            mockUserRepository.VerifyAll();
            mockEmailService.VerifyAll();
        }
    }
}
