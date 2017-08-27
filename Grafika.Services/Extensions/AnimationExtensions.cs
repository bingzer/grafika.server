using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Utilities;

namespace Grafika.Services.Extensions
{
    public static class AnimationExtensions
    {
        /// <summary>
        /// Returns the animation Url
        /// </summary>
        /// <param name="animation"></param>
        /// <returns></returns>
        public static string GetUrl(this Animation animation, bool useSlug = true)
        {
            return Utility.CombineUrl(AppEnvironment.Default.Server.Url, "animations", animation.Id, useSlug ? GetSlug(animation) : "");
        }

        /// <summary>
        /// Returns the animation Url
        /// </summary>
        /// <param name="animation"></param>
        /// <returns></returns>
        public static string GetUrlForEdit(this Animation animation)
        {
            return Utility.CombineUrl(animation.GetUrl(), "edit");
        }

        public static string GetAuthorUrl(this Animation animation)
        {
            return Utility.CombineUrl(AppEnvironment.Default.Server.Url, "users", animation.UserId, SeoFriendlyUrlExtensions.GenerateSlug(animation?.Author));
        }

        /// <summary>
        /// Returns the animation's API url
        /// </summary>
        /// <param name="animation"></param>
        /// <returns></returns>
        public static string GetApiUrl(this Animation animation)
        {
            return Utility.CombineUrl(AppEnvironment.Default.Server.ApiUrl, "animations", animation.Id);
        }

        public static string GetCommentApiUrl(this Animation animation)
        {
            return Utility.CombineUrl(GetApiUrl(animation), "comments?isPartial=true&BackgroundColor=transparent");
        }

        public static string GetThumbnailApiUrl(this Animation animation)
        {
            return Utility.CombineUrl(GetApiUrl(animation), "thumbnail");
        }

        public static string GetFrameApiUrl(this Animation animation)
        {
            return Utility.CombineUrl(GetApiUrl(animation), "frames");
        }

        public static string GetAuthorApiUrl(this Animation animation)
        {
            return Utility.CombineUrl(AppEnvironment.Default.Server.ApiUrl, "users", animation.UserId);
        }

        public static string GetAuthorAvatarApiUrl(this Animation animation)
        {
            return Utility.CombineUrl(GetAuthorApiUrl(animation), "avatar");
        }

        public static string GetSlug(this Animation animation)
        {
            return SeoFriendlyUrlExtensions.GenerateSlug(animation?.Name, "animation");
        }
    }
}
