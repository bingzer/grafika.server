using Grafika.Configurations;
using Grafika.Utilities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;

namespace Grafika.Services.Accounts
{
    internal static class AccountsUtils
    {
        internal static string GenerateUsername()
        {
            return "user-" + string.Format("{0:x6}", new Random((int)DateTime.Now.Ticks).Next(0x1000000));
        }

        internal static string RandomlyPickBackdrop(ServerConfiguration config)
        {
            var backdrop = Utility.RandomlyPickOne("001.png", "002.png", "003.png", "004.png", "005.png");
            return Utility.CombineUrl(config.Url, config.BackdropsPath, backdrop);
        }

        internal static UserActivation NewUserActivation(DateTimeOffset timestamp)
        {
            return new UserActivation
            {
                Hash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString(), 8),
                Timestamp = timestamp.UtcDateTime
            };
        }

        internal static UserPreference NewUserPreference(string username, ServerConfiguration config)
        {
            return new UserPreference
            {
                Avatar = Utility.CombineUrl(config.Url, config.DefaultAvatarPath),
                Backdrop = RandomlyPickBackdrop(config),
                DrawingAuthor = username,
                DrawingIsPublic = false,
                DrawingTimer = 1000,
                PlaybackLoop = true
            };
        }

        internal static UserStats NewUserStats(DateTimeOffset timestamp)
        {
            return new UserStats
            {
                DateLastSeen = timestamp.ToUnixTimeMilliseconds()
            };
        }

        internal static UserSubscriptions NewUserSubscriptions()
        {
            return new UserSubscriptions
            {
                EmailMarketing = false,
                EmailOnComments = true,
                EmailOnRating = true
            };
        }

        internal static string GetErrorMessages(this IdentityResult result)
        {
            if (result == null) return null;
            return string.Join(",", result.Errors.Select(e => e.Description));
        }

        internal static void ThrowIfFailed(this IdentityResult result)
        {
            if (!result.Succeeded)
                throw new NotValidException(result.GetErrorMessages());
        }
    }
}
