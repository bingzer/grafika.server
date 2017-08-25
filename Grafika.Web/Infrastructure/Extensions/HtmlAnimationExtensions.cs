using Grafika.Animations;
using Grafika.Services.Web.Extensions;
using Grafika.Web.ViewModels;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Grafika.Web.Infrastructure.Extensions
{
    public static class HtmlAnimationExtensions
    {
        /// <summary>
        /// Returns a href for an animation
        /// </summary>
        /// <param name="html"></param>
        /// <param name="animation"></param>
        /// <returns></returns>
        public static string AnimationUrl(this IHtmlHelper html, Animation animation)
        {
            return $"/animations/{animation.Id}/{animation.GetSlug()}";
        }
    }
}
