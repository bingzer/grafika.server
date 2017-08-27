using Grafika.Configurations;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;
using System.Linq;

namespace Grafika.Web.Infrastructure.Extensions
{
    public static class FacebookOAuthExtensions
    {
        public static void UseFacebookOAuth(this IApplicationBuilder app)
        {
            var fbOptions = (IOptions<FacebookOAuthProviderConfiguration>)app.ApplicationServices.GetService(typeof(IOptions<FacebookOAuthProviderConfiguration>));
            var config = fbOptions.Value;

            var options = new FacebookOptions
            {
                AutomaticChallenge = false,
                AutomaticAuthenticate = false,
                ClientId = config.Id,
                ClientSecret = config.Secret,
                CallbackPath = config.CallbackPath
            };
            options.Scope.Concat(config.Scopes.Split(",".ToCharArray()));

            app.UseFacebookAuthentication(options);
        }
    }
}
