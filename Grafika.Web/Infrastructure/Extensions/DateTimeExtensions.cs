using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;

namespace Grafika.Web.Infrastructure.Extensions
{
    public static class MvcHtmlDateTimeExtensions
    {
        /// <summary>
        /// UTC
        /// </summary>
        /// <param name="html"></param>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static IHtmlContent DisplayDateTime(this IHtmlHelper html, DateTimeOffset? dateTime)
        {
            if (dateTime == null) return HtmlString.Empty;

            return new HtmlString(dateTime.Value.ToString(html.ViewContext.HttpContext.Request.GetUICulture()));
        }

        /// <summary>
        /// UTC
        /// </summary>
        /// <param name="html"></param>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static IHtmlContent DisplayDate(this IHtmlHelper html, DateTimeOffset? dateTime)
        {
            if (dateTime == null) return HtmlString.Empty;

            var culture = html.ViewContext.HttpContext.Request.GetUICulture();
            return new HtmlString(dateTime.Value.ToString(culture.DateTimeFormat.ShortDatePattern));
        }
    }
}
