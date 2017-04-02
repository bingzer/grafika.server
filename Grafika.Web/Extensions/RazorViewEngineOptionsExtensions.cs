using Microsoft.AspNetCore.Mvc.Razor;

namespace Grafika.Web.Extensions
{
    public static class RazorViewEngineOptionsExtensions
    {
        public static void RegisterAdditionalViewLocations(this RazorViewEngineOptions options)
        {
            options.ViewLocationFormats.Add("~/Templates/{0}.cshtml");
            options.ViewLocationFormats.Add("~/Templates/Emails/{0}.cshtml");
            options.ViewLocationFormats.Add("~/Templates/Reports/{0}.cshtml");
        }
    }
}
