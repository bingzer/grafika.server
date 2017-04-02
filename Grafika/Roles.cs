using Grafika.Utilities;
using System.Linq;

namespace Grafika
{
    public static class Roles
    {
        public const string Administrator = "administrator";
        public const string System = "system";
        public const string Developer = "developer";
        public const string Moderator = "moderator";
        public const string User = "user";

        public static bool IsAdmin(this IUser user)
        {
            return user?.Roles?.Any(role => Administrator.EqualsIgnoreCase(role)) == true;
        }

        public static bool IsSystem(this IUser user)
        {
            return user?.Roles?.Any(role => System.EqualsIgnoreCase(role)) == true;
        }
    }
}
