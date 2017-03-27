using Grafika.Configurations;
using Grafika.Utilities;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;
using System.Linq;

namespace Grafika.Web.Extensions
{
    public static class GoogleOAuthExtensions
    {
        public static void UseGoogleOAuth(this IApplicationBuilder app)
        {
            var googleOptions = app.ApplicationServices.Get<IOptions<GoogleOAuthProviderConfiguration>>();
            var config = googleOptions.Value;
            var options = new GoogleOptions
            {
                AutomaticChallenge = false,
                AutomaticAuthenticate = false,
                ClientId = config.Id,
                ClientSecret = config.Secret,
                CallbackPath = config.CallbackPath
            };
            options.Scope.Concat(config.Scopes.Split(",".ToCharArray()));

            app.UseGoogleAuthentication(options);
        }
    }
}
