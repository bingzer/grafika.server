using Grafika.Configurations;
using Grafika.Utilities;

namespace Grafika.Services.Extensions
{
    public static class UserExtensions
    {
        /// <summary>
        /// Returns the user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string GetUrl(this IUser user)
        {
            if (user == null) return string.Empty;
            return Utility.CombineUrl(AppEnvironment.Default.Server.Url, "users", user.Id, GetSlug(user));
        }

        /// <summary>
        /// Returns the API url
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string GetApiUrl(this IUser user)
        {
            if (user == null) return string.Empty;
            return Utility.CombineUrl(AppEnvironment.Default.Server.ApiUrl, "users", user.Id);
        }

        public static string GetAvatarApiUrl(this IUser user)
        {
            return Utility.CombineUrl(GetApiUrl(user), "avatar");
        }

        public static string GetBackdropApiUrl(this IUser user)
        {
            return Utility.CombineUrl(GetApiUrl(user), "backdrop");
        }

        public static string GetSlug(this IUser user)
        {
            return SeoFriendlyUrlExtensions.GenerateSlug(user?.Username, "user");
        }
    }
}
