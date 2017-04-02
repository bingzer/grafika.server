using Grafika.Services.Accounts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Threading.Tasks;

namespace Grafika.Web.Extensions
{
    public static class JwtOAuthExtensions
    {
        public static void UseJwtOAuth(this IApplicationBuilder app)
        {
            var jwtTokenProvider = (AccountTokenProvider) app.ApplicationServices.GetService(typeof(AccountTokenProvider));
            app.UseJwtBearerAuthentication(jwtTokenProvider.GetDefaultJwtBearerOptions());
        }

        public static JwtBearerOptions GetDefaultJwtBearerOptions(this AccountTokenProvider tokenProvider)
        {
            Func<MessageReceivedContext, Task> FindToken = (context) =>
            {
                if (context.Token == null)
                    context.Token = context.Request.Query["token"];
                if (context.Token == null)
                    context.Token = context.Request.Query["access_token"];

                return Task.FromResult(0);
            };

            var options = new JwtBearerOptions
            {
                AutomaticAuthenticate = false,
                AutomaticChallenge = false,
                AuthenticationScheme = "jwt-bearer",
                TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = tokenProvider.SecurityKey,
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    AuthenticationType = "Bearer"
                },
                Events = new JwtBearerEvents { OnMessageReceived = FindToken }
            };
            options.SecurityTokenValidators.Clear();
            options.SecurityTokenValidators.Add(tokenProvider.TokenHandler);

            return options;
        }
    }
}
