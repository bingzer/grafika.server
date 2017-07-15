using System;

namespace Grafika.Utilities
{
    public static class StringExtensions
    {
        public static bool IsNullOrEmptyOrWhitespace(this string any)
        {
            return string.IsNullOrEmpty(any) || string.IsNullOrWhiteSpace(any);
        }

        public static string SafeTrim(this string any)
        {
            if (string.IsNullOrEmpty(any)) return null;
            return any.Trim();
        }

        public static bool EqualsIgnoreCase(this string any, string compare)
        {
            if (any == null && compare == null) return true;
            return any?.Equals(compare, StringComparison.CurrentCultureIgnoreCase) == true;
        }
    }
}
