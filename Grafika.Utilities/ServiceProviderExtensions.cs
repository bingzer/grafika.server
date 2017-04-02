using System;

namespace Grafika.Utilities
{
    public static class ServiceProviderExtensions
    {
        public static TAny Get<TAny>(this IServiceProvider serviceProvider)
        {
            return (TAny) serviceProvider.GetService(typeof(TAny));
        }
    }
}
