using Grafika.Services.Accounts;
using Grafika.Services.Web.Extensions;
using Grafika.Services.Web.Filters;
using Grafika.Services.Web.Middlewares;
using Grafika.Utilities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Grafika.Services.Web
{
    public static class WebSetups
    {
        public static void AddGrafikaMvc(this IServiceCollection services)
        {
            // -- GrafikaServices
            services.AddGrafikaServices();

            // -- services
            services.AddOptions();
            services.AddIdentity<User, UserRole>();
            services.AddScoped<IServiceContext>((provider) => new ServiceContext(provider.GetService<IHttpContextAccessor>()));
            services.AddScoped<ITemplatedRenderingEngine<string>, ViewRenderer>();

            services.AddAuthentication();
            services.AddAuthorization((auth) =>
            {
                auth.AddPolicy("User", builder => builder.RequireAuthenticatedUser().AddAuthenticationSchemes("cookie-auth").AddAuthenticationSchemes("jwt-bearer"));
                auth.AddPolicy("Administrator", builder => builder.RequireAuthenticatedUser().AddAuthenticationSchemes("cookie-auth").AddAuthenticationSchemes("jwt-bearer").RequireRole(Roles.Administrator));
            });

            var mvcBuilder = services.AddMvc(config =>
            {
                config.Filters.Add(new AuthorizeFilter("User"));
                config.Filters.Add(new ModelStateActionFilter());
            });
            mvcBuilder.AddJsonOptions(options => options.SerializerSettings.ApplySerializerSettings());
            mvcBuilder.AddRazorOptions(options => options.RegisterAdditionalViewLocations());
        }

        public static void ConfigureGrafikaMvc(this IServiceCollection services, IConfiguration configuration)
        {
            services.ConfigureGrafikaServices(configuration);

            services.Configure<IdentityOptions>((opt) =>
            {
                opt.Tokens.ProviderMap.Add(AccountTokenProvider.ProviderKey, AccountTokenProvider.ProviderDescriptor);
                opt.Tokens.ChangeEmailTokenProvider = AccountTokenProvider.ProviderKey;
                opt.Tokens.EmailConfirmationTokenProvider = AccountTokenProvider.ProviderKey;
                opt.Tokens.PasswordResetTokenProvider = AccountTokenProvider.ProviderKey;
                opt.User.RequireUniqueEmail = false; // because we're using "Username" as email
            });
        }

        public static void UseGrafikaMvc(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionHandlingMiddleware>();
            app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials());

            app.UseIdentity();
            app.UseGoogleOAuth();
            app.UseFacebookOAuth();
            app.UseJwtOAuth();
            app.UseCookieOAuth();
            app.UseGlobalization();

            app.UseGrafikaServices();
            
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
