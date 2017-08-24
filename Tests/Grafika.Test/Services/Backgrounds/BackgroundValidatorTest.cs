using Grafika.Animations;
using Grafika.Services.Backgrounds;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace Grafika.Test.Services.Backgrounds
{
    public class BackgroundValidatorTest
    {
        [Fact]
        public void TestSanitize_AccessNull()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User();

            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(null, user));
            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(null, null));
        }

        [Fact]
        public void TestSanitize_AnonymousUser_AccessPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User();
            Background background = new Background { UserId = "user1", IsPublic = true, IsRemoved = false };

            validator.Sanitize(background, user);
            validator.Sanitize(background, null);
        }

        [Fact]
        public void TestSanitize_AnonymousUser_AccessNonPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User();
            Background background = new Background { UserId = "user1", IsPublic = false, IsRemoved = false };

            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(background, user));
            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(background, null));
        }

        [Fact]
        public void TestSanitize_AdminUser_AccessPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User();
            user.Roles = new List<string> { Roles.Administrator };
            Background background = new Background { UserId = "user1", IsPublic = true, IsRemoved = false };

            validator.Sanitize(background, user);
        }

        [Fact]
        public void TestSanitize_AdminUser_AccessNonPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User();
            user.Roles = new List<string> { Roles.Administrator };
            Background background = new Background { UserId = "user1", IsPublic = false, IsRemoved = false };

            validator.Sanitize(background, user);
        }

        [Fact]
        public void TestSanitize_SystemUser_AccessPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User();
            user.Roles = new List<string> { Roles.System };
            Background background = new Background { UserId = "user1", IsPublic = true, IsRemoved = false };

            validator.Sanitize(background, user);
        }

        [Fact]
        public void TestSanitize_SystemUser_AccessNonPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User();
            user.Roles = new List<string> { Roles.System };
            Background background = new Background { UserId = "user1", IsPublic = false, IsRemoved = false };

            validator.Sanitize(background, user);
        }

        [Fact]
        public void TestSanitize_OwnerUser_AccessNonPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            Background background = new Background { UserId = "user1", IsPublic = false, IsRemoved = false };

            validator.Sanitize(background, user);
        }

        [Fact]
        public void TestSanitize_OwnerUser_AccessPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            Background background = new Background { UserId = "user1", IsPublic = true, IsRemoved = false };

            validator.Sanitize(background, user);
        }

        [Fact]
        public void TestSanitize_User1_AccessUser2NonPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            Background background = new Background { UserId = "user2", IsPublic = false, IsRemoved = false };

            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(background, user));
        }

        [Fact]
        public void TestSanitize_User1_AccessUser2Public()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            Background background = new Background { UserId = "user2", IsPublic = true, IsRemoved = false };

            validator.Sanitize(background, user);
        }

        [Fact]
        public void TestSanitize_User_AccessRemovedBackground()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            Background background = new Background { UserId = "user2", IsPublic = true, IsRemoved = true };

            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(background, user));
        }

        [Fact]
        public void TestSanitize_Admin_AccessRemovedBackground()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            user.Roles = new List<string> { Roles.Administrator };
            Background background = new Background { UserId = "user2", IsPublic = true, IsRemoved = true };

            validator.Sanitize(background, user);
        }

        [Fact]
        public void TestSanitize_System_AccessRemovedBackground()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new BackgroundValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            user.Roles = new List<string> { Roles.System };
            Background background = new Background { UserId = "user2", IsPublic = true, IsRemoved = true };

            validator.Sanitize(background, user);
        }
    }
}
