using Grafika.Animations;
using Grafika.Services.Animations;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Animations
{
    public class AnimationValidatorTest
    {
        [Fact]
        public void TestSanitize_AccessNull()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User();

            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(null, user));
            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(null, null));
        }

        [Fact]
        public void TestSanitize_AnonymousUser_AccessPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User();
            Animation animation = new Animation { UserId = "user1", IsPublic = true, IsRemoved = false };

            validator.Sanitize(animation, user);
            validator.Sanitize(animation, null);
        }

        [Fact]
        public void TestSanitize_AnonymousUser_AccessNonPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User();
            Animation animation = new Animation { UserId = "user1", IsPublic = false, IsRemoved = false };

            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(animation, user));
            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(animation, null));
        }

        [Fact]
        public void TestSanitize_AdminUser_AccessPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User();
            user.Roles = new List<string> { Roles.Administrator };
            Animation animation = new Animation { UserId = "user1", IsPublic = true, IsRemoved = false };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_AdminUser_AccessNonPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User();
            user.Roles = new List<string> { Roles.Administrator };
            Animation animation = new Animation { UserId = "user1", IsPublic = false, IsRemoved = false };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_SystemUser_AccessPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User();
            user.Roles = new List<string> { Roles.System };
            Animation animation = new Animation { UserId = "user1", IsPublic = true, IsRemoved = false };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_SystemUser_AccessNonPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User();
            user.Roles = new List<string> { Roles.System };
            Animation animation = new Animation { UserId = "user1", IsPublic = false, IsRemoved = false };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_OwnerUser_AccessNonPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            Animation animation = new Animation { UserId = "user1", IsPublic = false, IsRemoved = false };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_OwnerUser_AccessPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            Animation animation = new Animation { UserId = "user1", IsPublic = true, IsRemoved = false };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_User1_AccessUser2NonPublic()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            Animation animation = new Animation { UserId = "user2", IsPublic = false, IsRemoved = false };

            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(animation, user));
        }

        [Fact]
        public void TestSanitize_User1_AccessUser2Public()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            Animation animation = new Animation { UserId = "user2", IsPublic = true, IsRemoved = false };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_User_AccessRemovedAnimation()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            Animation animation = new Animation { UserId = "user2", IsPublic = true, IsRemoved = true };

            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(animation, user));
        }

        [Fact]
        public void TestSanitize_Admin_AccessRemovedAnimation()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            user.Roles = new List<string> { Roles.Administrator };
            Animation animation = new Animation { UserId = "user2", IsPublic = true, IsRemoved = true };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_System_AccessRemovedAnimation()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            User user = new User { Id = "user1" };
            user.Roles = new List<string> { Roles.System };
            Animation animation = new Animation { UserId = "user2", IsPublic = true, IsRemoved = true };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestValidateId()
        {
            var mockEntityIdValidator = new Mock<IEntityIdValidator>();
            mockEntityIdValidator.Setup(c => c.ValidateId(It.Is<string>(str => str == "SomeId"))).Verifiable();

            var validator = new AnimationValidator(mockEntityIdValidator.Object);
            validator.ValidateId("SomeId");

            mockEntityIdValidator.VerifyAll();
        }
    }
}
