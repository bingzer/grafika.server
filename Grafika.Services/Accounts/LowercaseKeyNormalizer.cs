using Microsoft.AspNetCore.Identity;

namespace Grafika.Services.Accounts
{
    class LowercaseKeyNormalizer : ILookupNormalizer
    {
        public string Normalize(string key)
        {
            return key?.ToLowerInvariant();
        }
    }
}
