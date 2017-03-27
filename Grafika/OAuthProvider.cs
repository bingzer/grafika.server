using System;
using System.ComponentModel;
using System.Globalization;

namespace Grafika
{
    [TypeConverter(typeof(OAuthProviderTypeConverter))]
    public enum OAuthProvider
    {
        Google,
        Facebook,

        Disqus
    }

    public class OAuthProviderTypeConverter : TypeConverter
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
                if (Enum.TryParse<OAuthProvider>((string) value, out var result))
                    return result;
            }

            return base.ConvertFrom(context, culture, value);
        }
    }
}
