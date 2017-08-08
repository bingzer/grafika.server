using System;

namespace Grafika.Utilities
{
    /// <summary>
    /// All general utility functions
    /// </summary>
    public static class Utility
    {
        private readonly static Random rand = new Random();

        public static string CombineUrl(string url, params string[] others)
        {
            foreach (var o in others)
            {
                url = CombineUrl(url, o);
            }
            return url;
        }

        public static string CombineUrl(string url, string other)
        {
            if (url == null) url = "";
            if (other == null) other = "";

            url = url.TrimEnd('/');
            other = other.TrimStart('/');

            return $"{url}/{other}".TrimEnd('/');
        }

        public static string CombineUrl(Uri uri, string other)
        {
            return CombineUrl(uri.ToString(), other);
        }

        public static string UrlEncode(string url)
        {
            return Uri.EscapeDataString(url);
        }

        public static TAny RandomlyPickOne<TAny>(params TAny[] any)
        {
            return any[rand.Next(any.Length)];
        }

        public static int RandomlyPickFrom(int min, int max)
        {
            return rand.Next(min, max);
        }

        public static string Guid()
        {
            return System.Guid.NewGuid().ToString();
        }
    }
}
