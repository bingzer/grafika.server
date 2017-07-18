using Grafika.Configurations;
using Grafika.Utilities;

namespace Grafika.Services.Web.Extensions
{
    public static class UserIdentityExtensions
    {
        public static string GetUserApiUrl(this IUserIdentity userIdentity)
        {
            if (userIdentity == null) return string.Empty;
            return Utility.CombineUrl(AppEnvironment.Default.Server.Url, "users", userIdentity.Id);
        }

        public static string GetUserAvatarUrl(this IUserIdentity userIdentity)
        {
            return Utility.CombineUrl(GetUserApiUrl(userIdentity), "avatar");
        }

        public static string GetUserBackdropUrl(this IUserIdentity userIdentity)
        {
            return Utility.CombineUrl(GetUserApiUrl(userIdentity), "backdrop");
        }
    }
}
