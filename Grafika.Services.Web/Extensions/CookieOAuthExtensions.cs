using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
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
                LoginPath = new PathString("/signin"),
                AccessDeniedPath = new PathString("/forbidden"),
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                ExpireTimeSpan = TimeSpan.FromDays(30),
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
