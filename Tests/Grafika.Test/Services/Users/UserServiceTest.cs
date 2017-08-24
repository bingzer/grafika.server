using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Users;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services.Users
{
    public class UserServiceTest
    {
        ContentConfiguration contentConfig = new ContentConfiguration
        {
            Url = "http://me.com/",
            DefaultAvatarPath = "default/avatar",
            DefaultBackdropPath = "default/backdrop"
        };

        [Fact]
        public async void TestCreateEntityForUpdate()
        {
            var mockUserRepo = new Mock<IUserRepository>();
            mockUserRepo.Setup(c => c.CheckUsernameAvailability(It.IsAny<User>(), It.IsAny<string>()))
                .Returns(Task.FromResult(0))
                .Verifiable();
            var mockUserValidator = new Mock<IUserValidator>();
            
            var userService = new UserService(MockHelpers.ServiceContext.Object, mockUserRepo.Object, mockUserValidator.Object, null, CreateMockContentOptions().Object);
            var update = await userService.CreateEntityForUpdate(new User { FirstName = "FN", LastName = "LN", Username = "U" });

            Assert.Equal("FN", update.FirstName);
            Assert.Equal("LN", update.LastName);
            Assert.Equal("U", update.Username);

            mockUserRepo.VerifyAll();
        }
        
        [Fact]
        public async void TestUpdateLastSeen()
        {
            var mockUserRepo = new Mock<IUserRepository>();
            mockUserRepo.Setup(c => c.Update(It.IsAny<User>()))
                .ReturnsAsync(new User())
                .Verifiable();
            var mockUserValidator = new Mock<IUserValidator>();

            var userService = new UserService(MockHelpers.ServiceContext.Object, mockUserRepo.Object, mockUserValidator.Object, null, CreateMockContentOptions().Object);
            await userService.UpdateLastSeen(new User("userId"));

            mockUserRepo.Verify(c =>
                c.Update(
                    It.Is<User>(usr => usr.Id == "userId" && usr.Stats.DateLastSeen > 0)
                )
            );
            mockUserRepo.VerifyAll();
        }

        [Theory]
        [InlineData("userId", "avatar", "/custom-avatar", "http://me.com/custom-avatar")]
        [InlineData("userId", "avatar", "//custom-avatar", "http://me.com/custom-avatar")]
        [InlineData("userId", "backdrop", "/custom-backdrop", "http://me.com/custom-backdrop")]
        [InlineData("userId", "backdrop", "//custom-backdrop", "http://me.com/custom-backdrop")]
        [InlineData("userId", "avatar", null, "http://me.com/default/avatar")]
        [InlineData("userId", "backdrop", null, "http://me.com/default/backdrop")]
        [InlineData("userId", "backdrop", "asset/backdrop.png", "http://me.com/asset/backdrop.png")]
        [InlineData("userId", "avatar", "asset/avatar.png", "http://me.com/asset/avatar.png")]
        [InlineData("userId", "avatar", "http://example.com/avatar.jpg", "http://example.com/avatar.jpg")]
        [InlineData("userId", "backdrop", "http://example.com/backdrop.jpg", "http://example.com/backdrop.jpg")]
        public async void TestGetAvatarOrBackdropUrl(string userId, string type, string prefValue, string urlExpected)
        {
            var user = new User { Id = userId, Prefs = new UserPreference() };
            if (type == "avatar" && prefValue != null)
                user.Prefs.Avatar = prefValue;
            if (type == "backdrop" && prefValue != null)
                user.Prefs.Backdrop = prefValue;

            var mockUserRepo = new Mock<IUserRepository>();
            mockUserRepo.Setup(c => c.First(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(user)
                .Verifiable();

            var mockUserValidator = new Mock<IUserValidator>();
            mockUserValidator.Setup(c => c.ValidateId(It.IsAny<string>()))
                .Returns(true)
                .Verifiable();

            var userService = new UserService(MockHelpers.ServiceContext.Object, mockUserRepo.Object, mockUserValidator.Object, null, CreateMockContentOptions().Object);
            var actual = await userService.GetAvatarOrBackdropUrl(userId, type);

            mockUserRepo.VerifyAll();
            mockUserValidator.VerifyAll();

            Assert.Equal(urlExpected, actual);
        }

        [Fact]
        public async void TextCreateSignedUrl()
        {
            var user = new User { Id = "userId" };

            var mockUserRepo = new Mock<IUserRepository>();
            mockUserRepo.Setup(c => c.First(It.IsAny<UserQueryOptions>()))
                .ReturnsAsync(user)
                .Verifiable();

            var mockSignedUrl = new Mock<ISignedUrl>();

            var mockUserValidator = new Mock<IUserValidator>();
            mockUserValidator.Setup(c => c.ValidateId(It.IsAny<string>()))
                .Returns(true)
                .Verifiable();

            var mockAwsRepo = new Mock<IAwsUsersRepository>();
            mockAwsRepo.Setup(c => c.CreateSignedUrl(
                It.Is<User>(u => u.Id == "userId"),
                It.Is<string>(str => str == "imageType"),
                It.Is<string>(str => str == "contentType")))
                .ReturnsAsync(mockSignedUrl.Object);

            var userService = new UserService(MockHelpers.ServiceContext.Object, mockUserRepo.Object, mockUserValidator.Object, mockAwsRepo.Object, CreateMockContentOptions().Object);
            await userService.CreateSignedUrl("userId", "imageType", "contentType");

            mockUserRepo.VerifyAll();
            mockAwsRepo.VerifyAll();
            mockUserValidator.VerifyAll();
        }


        private Mock<IOptions<ContentConfiguration>> CreateMockContentOptions()
        {
            var mock = new Mock<IOptions<ContentConfiguration>>();
            mock.Setup(c => c.Value).Returns(contentConfig);
            return mock;
        }
    }
}
