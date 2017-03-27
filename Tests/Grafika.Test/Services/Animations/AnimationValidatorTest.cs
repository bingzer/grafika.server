using Grafika.Animations;
using Grafika.Services.Animations;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Animations
{
    public class AnimationValidatorTest
    {
        [Fact]
        public void TestSanitize_AnonymousUser_AccessPublic()
        {
            var validator = new AnimationValidator();
            User user = new User();
            Animation animation = new Animation { UserId = "user1", IsPublic = true };

            validator.Sanitize(animation, user);
            validator.Sanitize(animation, null);
        }

        [Fact]
        public void TestSanitize_AnonymousUser_AccessNonPublic()
        {
            var validator = new AnimationValidator();
            User user = new User();
            Animation animation = new Animation { UserId = "user1", IsPublic = false };

            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(animation, user));
            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(animation, null));
        }

        [Fact]
        public void TestSanitize_AdminUser_AccessPublic()
        {
            var validator = new AnimationValidator();
            User user = new User();
            user.Roles = new List<string> { Roles.Administrator };
            Animation animation = new Animation { UserId = "user1", IsPublic = true };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_AdminUser_AccessNonPublic()
        {
            var validator = new AnimationValidator();
            User user = new User();
            user.Roles = new List<string> { Roles.Administrator };
            Animation animation = new Animation { UserId = "user1", IsPublic = false };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_SystemUser_AccessPublic()
        {
            var validator = new AnimationValidator();
            User user = new User();
            user.Roles = new List<string> { Roles.System };
            Animation animation = new Animation { UserId = "user1", IsPublic = true };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_SystemUser_AccessNonPublic()
        {
            var validator = new AnimationValidator();
            User user = new User();
            user.Roles = new List<string> { Roles.System };
            Animation animation = new Animation { UserId = "user1", IsPublic = false };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_OwnerUser_AccessNonPublic()
        {
            var validator = new AnimationValidator();
            User user = new User { Id = "user1" };
            Animation animation = new Animation { UserId = "user1", IsPublic = false };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_OwnerUser_AccessPublic()
        {
            var validator = new AnimationValidator();
            User user = new User { Id = "user1" };
            Animation animation = new Animation { UserId = "user1", IsPublic = true };

            validator.Sanitize(animation, user);
        }

        [Fact]
        public void TestSanitize_User1_AccessUser2NonPublic()
        {
            var validator = new AnimationValidator();
            User user = new User { Id = "user1" };
            Animation animation = new Animation { UserId = "user2", IsPublic = false };

            Assert.Throws<NotAuthorizedException>(() => validator.Sanitize(animation, user));
        }

        [Fact]
        public void TestSanitize_User1_AccessUser2Public()
        {
            var validator = new AnimationValidator();
            User user = new User { Id = "user1" };
            Animation animation = new Animation { UserId = "user2", IsPublic = true };

            validator.Sanitize(animation, user);
        }
    }
}
