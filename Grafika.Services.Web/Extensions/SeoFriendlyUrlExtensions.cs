using Microsoft.AspNetCore.Mvc.Rendering;
using System.Text.RegularExpressions;

namespace Grafika.Services.Web.Extensions
{
    public static class SeoFriendlyUrlExtensions
    {
        public static string GenerateSlug(this IHtmlHelper htmlHelper, string name)
        {
            return GenerateSlug(name);
        }

        public static string GenerateSlug(string name, string defaultIfEmpty = "unknown")
        {
            string phrase = name;

            string str = RemoveAccent(phrase).ToLower();
            // invalid chars           
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            // convert multiple spaces into one space   
            str = Regex.Replace(str, @"\s+", " ").Trim();
            // cut and trim 
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
            str = Regex.Replace(str, @"\s", "-"); // hyphens   

            if (string.IsNullOrEmpty(str))
                str = defaultIfEmpty;

            return str;
        }

        private static string RemoveAccent(string text)
        {
            byte[] bytes = System.Text.Encoding.GetEncoding("UTF-8").GetBytes(text);
            return System.Text.Encoding.ASCII.GetString(bytes);
        }
    }
}
