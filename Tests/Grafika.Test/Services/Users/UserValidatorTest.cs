using Grafika.Services.Users;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Users
{
    public class UserValidatorTest
    {
        [Fact]
        public void TestSanitizeUsers_Admin()
        {
            var user = new User();
            user.Roles = new List<string> { Roles.Administrator };

            var targetUser = new User
            {
                Id = "user1",
                Email = "user1@email.com",
                Activation = new UserActivation { Hash = "hashForUser1", Timestamp = DateTime.UtcNow },
                Local = new UserLocal { IsRegistered = true, Password = "passForUser1" },
                Stats = new UserStats { DateLastSeen = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() }
            };

            var validator = new UserValidator();
            validator.Sanitize(targetUser, user);

            Assert.NotNull(targetUser.Email);
            Assert.NotNull(targetUser.Activation);
            Assert.NotNull(targetUser.Activation.Hash);
            Assert.NotNull(targetUser.Activation.Timestamp);
            Assert.NotNull(targetUser.Local);
            Assert.NotNull(targetUser.Local.IsRegistered);
            Assert.Null(targetUser.Local.Password);
            Assert.NotNull(targetUser.Stats);
            Assert.NotNull(targetUser.Stats.DateLastSeen);
        }

        [Fact]
        public void TestSanitizeUsers_System()
        {
            var user = new User();
            user.Roles = new List<string> { Roles.System };

            var targetUser = new User
            {
                Id = "user1",
                Email = "user1@email.com",
                Activation = new UserActivation { Hash = "hashForUser1", Timestamp = DateTime.UtcNow },
                Local = new UserLocal { IsRegistered = true, Password = "passForUser1" },
                Stats = new UserStats { DateLastSeen = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() }
            };

            var validator = new UserValidator();
            validator.Sanitize(targetUser, user);

            Assert.NotNull(targetUser.Email);
            Assert.NotNull(targetUser.Activation);
            Assert.NotNull(targetUser.Activation.Hash);
            Assert.NotNull(targetUser.Activation.Timestamp);
            Assert.NotNull(targetUser.Local);
            Assert.NotNull(targetUser.Local.IsRegistered);
            Assert.Null(targetUser.Local.Password);
            Assert.NotNull(targetUser.Stats);
            Assert.NotNull(targetUser.Stats.DateLastSeen);
        }

        [Fact]
        public void TestSanitizeUsers_Owner()
        {
            var user = new User { Id = "user1" };

            var targetUser = new User
            {
                Id = "user1",
                Email = "user1@email.com",
                Activation = new UserActivation { Hash = "hashForUser1", Timestamp = DateTime.UtcNow },
                Local = new UserLocal { IsRegistered = true, Password = "passForUser1" },
                Stats = new UserStats { DateLastSeen = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() }
            };

            var validator = new UserValidator();
            validator.Sanitize(targetUser, user);

            Assert.NotNull(targetUser.Email);
            Assert.Null(targetUser.Activation);
            Assert.NotNull(targetUser.Local);
            Assert.NotNull(targetUser.Local.IsRegistered);
            Assert.Null(targetUser.Local.Password);
            Assert.Null(targetUser.Stats);
        }

        [Fact]
        public void TestSanitizeUsers_OtherUser()
        {
            var user = new User { Id = "user3" };

            var targetUser = new User
            {
                Id = "user1",
                Email = "user1@email.com",
                Activation = new UserActivation { Hash = "hashForUser1", Timestamp = DateTime.UtcNow },
                Local = new UserLocal { IsRegistered = true, Password = "passForUser1" },
                Stats = new UserStats { DateLastSeen = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() }
            };

            var validator = new UserValidator();
            validator.Sanitize(targetUser, user);

            Assert.Null(targetUser.Email);
            Assert.Null(targetUser.Activation);
            Assert.NotNull(targetUser.Local);
            Assert.NotNull(targetUser.Local.IsRegistered);
            Assert.Null(targetUser.Local.Password);
            Assert.Null(targetUser.Stats);
        }

        [Fact]
        public void TestSanitizeUsers_NullUser()
        {
            var targetUser = new User
            {
                Id = "user1",
                Email = "user1@email.com",
                Activation = new UserActivation { Hash = "hashForUser1", Timestamp = DateTime.UtcNow },
                Local = new UserLocal { IsRegistered = true, Password = "passForUser1" },
                Stats = new UserStats { DateLastSeen = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() }
            };

            var validator = new UserValidator();
            validator.Sanitize(targetUser, null);

            Assert.Null(targetUser.Email);
            Assert.Null(targetUser.Activation);
            Assert.NotNull(targetUser.Local);
            Assert.NotNull(targetUser.Local.IsRegistered);
            Assert.Null(targetUser.Local.Password);
            Assert.Null(targetUser.Stats);
        }
    }
}
