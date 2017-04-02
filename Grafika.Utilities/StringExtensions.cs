using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Utilities
{
    public static class StringExtensions
    {
        public static bool EqualsIgnoreCase(this string any, string compare)
        {
            if (any == null && compare == null) return true;
            return any?.Equals(compare, StringComparison.CurrentCultureIgnoreCase) == true;
        }
    }
}
