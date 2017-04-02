using Grafika.Utilities;
using Grafika.Web.Filters;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Grafika.Services.Accounts;
using Microsoft.AspNetCore.Builder;
using Grafika.Services;
using Grafika.Web.Infrastructure;
using Microsoft.AspNetCore.Http;

namespace Grafika.Web.Extensions
{
    public static class MvcConfigurationExtensions
    {
        public static IMvcBuilder AddGrafikaMvc(this IServiceCollection services)
        {
            services.AddIdentity<User, UserRole>();
            services.AddScoped<IServiceContext>((provider) => new ServiceContext(provider.GetService<IHttpContextAccessor>()));
            services.AddScoped<ITemplatedRenderingEngine<string>, ViewRenderer>();

            services.AddAuthentication();
            services.AddAuthorization((auth) =>
            {
                auth.AddPolicy("User", builder => builder.RequireAuthenticatedUser().AddAuthenticationSchemes("jwt-bearer"));
                auth.AddPolicy("Administrator", builder => builder.RequireAuthenticatedUser().AddAuthenticationSchemes("jwt-bearer").RequireRole(Roles.Administrator));
            });

            var mvcBuilder = services.AddMvc(config => 
            {
                config.Filters.Add(new AuthorizeFilter("User"));
                config.Filters.Add(new ModelStateActionFilter());
            });
            mvcBuilder.AddJsonOptions(options => options.SerializerSettings.ApplySerializerSettings());
            mvcBuilder.AddRazorOptions(options => options.RegisterAdditionalViewLocations());

            return mvcBuilder;
        }

        public static void ConfigureGrafikaMvc(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<IdentityOptions>((opt) =>
            {
                opt.Cookies.ApplicationCookie.AutomaticChallenge = false;
                opt.Tokens.ProviderMap.Add(AccountTokenProvider.ProviderKey, AccountTokenProvider.ProviderDescriptor);
                opt.Tokens.ChangeEmailTokenProvider = AccountTokenProvider.ProviderKey;
                opt.Tokens.EmailConfirmationTokenProvider = AccountTokenProvider.ProviderKey;
                opt.Tokens.PasswordResetTokenProvider = AccountTokenProvider.ProviderKey;
                opt.User.RequireUniqueEmail = false; // because we're using "Username" as email
            });
        }
    }
}
