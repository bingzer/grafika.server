using System.Text.RegularExpressions;

namespace Grafika
{
    public static class ContentTypes
    {
        public const string Json = "application/json";
        public const string Text = "text/plain";
        public const string Html = "text/html";
        public const string Xml = "application/xml";
        public const string Png = "image/png";
        public const string Jpg = "image/jpg";
        public const string Gif = "image/gif";

        /// <summary>
        /// Removes 'charset' from the content type
        /// </summary>
        /// <param name="contentType"></param>
        /// <returns></returns>
        public static string NoCharset(string contentType)
        {
            if (contentType?.Contains(";") == true)
                contentType = Regex.Replace(contentType, ";.*", "");

            return contentType;
        }
    }
}
