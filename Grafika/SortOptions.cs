using System;
using System.ComponentModel;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Grafika
{
    [TypeConverter(typeof(SortOptionsTypeConverter))]
    public class SortOptions
    {
        public string Name { get; set; }
        public SortDirection Direction { get; set; } = SortDirection.Ascending;

        /// <summary>
        /// Parses example:
        /// -example => Name = example, Direction = Descending
        /// example  => Name = example, Direction = Ascending
        /// +example => Name = example, Direction = Ascending
        /// </summary>
        /// <param name="input"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public static bool TryParse(string input, out SortOptions result)
        {
            result = new SortOptions();

            result.Direction = SortDirection.Ascending;
            if (input.StartsWith("-", System.StringComparison.CurrentCultureIgnoreCase))
            {
                input = input.Replace("-", "");
                result.Direction = SortDirection.Descending;
            }
            else if (input.StartsWith("+", System.StringComparison.CurrentCultureIgnoreCase))
                input = input.Replace("+", "");

            if (Regex.IsMatch(input, "^[a-zA-Z0-9]*$"))
            {
                result.Name = input.Trim();
                return true;
            }

            return false;
        }
    }

    public enum SortDirection
    {
        Ascending = 1,
        Descending = -1
    }

    public class SortOptionsTypeConverter : TypeConverter
    {

        public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
        {
            if (sourceType == typeof(string))
            {
                return true;
            }
            return base.CanConvertFrom(context, sourceType);
        }

        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {
            if (value is string)
            {
                if (SortOptions.TryParse((string)value, out var options))
                    return options;
            }

            return base.ConvertFrom(context, culture, value);
        }
    }
}
