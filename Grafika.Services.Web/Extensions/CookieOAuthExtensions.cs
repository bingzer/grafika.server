using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Grafika.Services.Web.Extensions
{
    public static class CookieOAuthExtensions
    {
        public static void UseCookieOAuth(this IApplicationBuilder app)
        {
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationScheme = "cookie-auth",
                LoginPath = new PathString("/account/login"),
                AccessDeniedPath = new PathString("/account/forbidden"),
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                Events = new CookieAuthenticationEvents
                {
                    OnValidatePrincipal = (ctx) =>
                    {
                        var userIdentity = new UserIdentity(ctx.Principal);
                        var principal = new ClaimsPrincipal(userIdentity);
                        ctx.ReplacePrincipal(principal);
                        return Task.FromResult(principal);
                    }
                },
            });
        }
    }
}
