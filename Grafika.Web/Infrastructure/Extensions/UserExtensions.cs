using Grafika.Configurations;
using Grafika.Utilities;

namespace Grafika.Web.Infrastructure.Extensions
{
    public static class UserExtensions
    {
        public static string GetUserApiUrl(this IUser user)
        {
            if (user == null) return string.Empty;
            return Utility.CombineUrl(AppEnvironment.Default.Server.Url, "users", user.Id);
        }

        public static string GetUserAvatarUrl(this IUser user)
        {
            return Utility.CombineUrl(GetUserApiUrl(user), "avatar");
        }

        public static string GetUserBackdropUrl(this IUser user)
        {
            return Utility.CombineUrl(GetUserApiUrl(user), "backdrop");
        }
    }
}
