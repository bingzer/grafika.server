using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Grafika.WebSite.Infrastructure.Extensions
{
    public static class HtmlUserExtensions
    {
        /// <summary>
        /// Returns a url an user
        /// </summary>
        /// <param name="html"></param>
        /// <param name="animation"></param>
        /// <returns></returns>
        public static string UserUrl(this IHtmlHelper html, string userIdOrUsername)
        {
            return $"/users/{userIdOrUsername}";
        }
    }
}
