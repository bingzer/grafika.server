using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;

namespace Grafika.Services.Web.Extensions
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

            return new HtmlString(dateTime.Value.ToString(html.ViewContext.HttpContext.Request.GetCulture()));
        }
    }
}
