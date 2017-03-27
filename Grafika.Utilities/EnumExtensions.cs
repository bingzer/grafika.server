using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Utilities
{
    public static class EnumExtensions
    {
        public static string GetName(this Enum any)
        {
            return Enum.GetName(any.GetType(), any);
        }
    }
}
