using Grafika.Configurations;
using Grafika.Services.Accounts;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Accounts
{
    public class AccountsUtilsTest
    {
        [Fact]
        public void TestGenerateUsername()
        {
            var random = AccountsUtils.GenerateUsername();
            Assert.NotNull(random);
            Assert.NotEmpty(random);
        }

        [Fact]
        public void TestRandomlyPickBackdrop()
        {
            var serverConfig = new ServerConfiguration { Url = "url" };
            var backdrop = AccountsUtils.RandomlyPickBackdrop(serverConfig);
            Assert.StartsWith("url/", backdrop);
        }

        [Fact]
        public void TestNewUserActivation()
        {
            var now = DateTimeOffset.UtcNow;
            var activation = AccountsUtils.NewUserActivation(now);

            Assert.NotNull(activation.Hash);
            Assert.Equal(now.DateTime, activation.Timestamp);
        }

        [Fact]
        public void TestNewUserPreference()
        {
            var contentConfig = new ServerConfiguration { Url = "url", DefaultAvatarPath = "avatar" };
            var pref = AccountsUtils.NewUserPreference("username", contentConfig);

            Assert.Equal("url/avatar", pref.Avatar);
            Assert.Equal("username", pref.DrawingAuthor);
            Assert.Equal(false, pref.DrawingIsPublic);
            Assert.Equal(1000, pref.DrawingTimer);
            Assert.Equal(true, pref.PlaybackLoop);
        }

        [Fact]
        public void TestNewUserStats()
        {
            var now = DateTimeOffset.UtcNow;
            var stats = AccountsUtils.NewUserStats(now);

            Assert.Equal(stats.DateLastSeen, now.ToUnixTimeMilliseconds());
        }

        [Fact]
        public void TestNewUserSubscriptions()
        {
            var subs = AccountsUtils.NewUserSubscriptions();
            Assert.Equal(false, subs.EmailMarketing);
            Assert.Equal(true, subs.EmailOnComments);
            Assert.Equal(true, subs.EmailOnRating);
        }

        [Fact]
        public void TestGetErrorMessages()
        {
            var result = IdentityResult.Failed(
                new IdentityError { Code = "1", Description = "desc1" },
                new IdentityError { Code = "1", Description = "desc2" }
                );

            var actual = AccountsUtils.GetErrorMessages(result);
            Assert.Equal("desc1,desc2", actual);
        }

        [Fact]
        public void TestThrowIfFailed()
        {
            var result = IdentityResult.Failed();

            Assert.Throws<NotValidException>(() => AccountsUtils.ThrowIfFailed(result));
        }
    }
}
