using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Utilities;

namespace Grafika.Services.Web.Extensions
{
    public static class AnimationExtensions
    {
        public static string GetUrl(this Animation animation)
        {
            return Utility.CombineUrl(AppEnvironment.Default.Server.Url, "animations", animation.Id);
        }
        public static string GetCommentUrl(this Animation animation)
        {
            return Utility.CombineUrl(GetUrl(animation), "comments");
        }

        public static string GetThumbnailUrl(this Animation animation)
        {
            return Utility.CombineUrl(GetUrl(animation), "thumbnail");
        }

        public static string GetFramesUrl(this Animation animation)
        {
            return Utility.CombineUrl(GetUrl(animation), "frames");
        }

        public static string GetAuthorUrl(this Animation animation)
        {
            return Utility.CombineUrl(AppEnvironment.Default.Server.Url, "users", animation.UserId);
        }

        public static string GetAuthorThumbnail(this Animation animation)
        {
            return Utility.CombineUrl(GetAuthorUrl(animation), "avatar");
        }
    }
}
