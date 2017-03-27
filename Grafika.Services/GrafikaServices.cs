using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Data.Providers;
using Grafika.Services.Accounts;
using Grafika.Services.Accounts.Stores;
using Grafika.Services.Accounts.Tokens;
using Grafika.Services.Admins;
using Grafika.Services.Animations;
using Grafika.Services.Animations.Mongo;
using Grafika.Services.Aws;
using Grafika.Services.Comments;
using Grafika.Services.Disqus;
using Grafika.Services.Emails;
using Grafika.Services.Providers;
using Grafika.Services.Syncs;
using Grafika.Services.Users;

namespace Grafika.Services
{
    public static class GrafikaServices
    {
        public static void AddGrafika(this IServiceCollection services)
        {
            // -- Grafika.Data
            Data.DependencyInjections.AddServices(services);

            // -- Animations
            services
                .AddSingleton(AppEnvironment.Default)
                .AddScoped<IAnimationService, AnimationService>()
                .AddScoped<IAnimationEmailService, AnimationEmailService>()
                .AddScoped<IAnimationRepository, AnimationRepository>()
                .AddScoped<ITextSearchProvider<Animation, AnimationQueryOptions>, Animations.Mongo.TextSearchProvider>()
                .AddScoped<IBulkRemoveProvider<Animation>, BulkRemoveProvider>()
                .AddSingleton<IAnimationValidator, AnimationValidator>()
                .AddSingleton<IFrameDataProcessingFactory, FrameDataProcesingFactory>()
            ;

            // -- Aws
            services
                .AddScoped<IAwsFrameRepository, AwsFrameRepository>()
                .AddScoped<IAwsResourceRepository, AwsResourceRepository>()
                .AddScoped<IAwsUsersRepository, AwsUsersRepository>()
                ;

            // -- Users
            services
                .AddScoped<IUserService, UserService>()
                .AddScoped<IUserRepository, UserRepository>()
                .AddSingleton<IUserValidator, UserValidator>()
                .AddScoped<ITextSearchProvider<User, UserQueryOptions>, Users.Mongo.TextSearchProvider>();
                ;

            // -- Accounts
            services
                .AddScoped<IAccountService, AccountService>()
                .AddScoped<IAccountEmailService, AccountEmailService>()
                .AddScoped<IAccountStore, AccountStore>()
                .AddScoped<ILookupNormalizer, LowercaseKeyNormalizer>()
                .AddSingleton<IPasswordHasher<User>, BCryptPasswordHasher>()
                .AddSingleton<IUserStore<User>, AccountStore>()
                .AddSingleton<IRoleStore<UserRole>, RoleService>()
                .AddSingleton<AccountTokenProvider, AccountTokenProvider>()
                .AddScoped<ITokenExchangeStrategyFactory, TokenExchangeStrategyFactory>()
                .AddScoped<GoogleTokenExchangeStrategy, GoogleTokenExchangeStrategy>()
                .AddScoped<FacebookTokenExchangeStrategy, FacebookTokenExchangeStrategy>()
                ;

            // -- Emails
            services
                .AddScoped<IEmailService, EmailService>()
                ;

            // -- Syncs
            services
                .AddScoped<ISyncService, SyncService>()
                ;

            // -- Comments
            services
                .AddScoped<ICommentService, CommentService>()
                .AddScoped<ICommentProvider, DisqusProvider>()
                ;

            // -- Admin
            services
                .AddScoped<IAdminService, AdminService>()
                ;
        }

        public static void ConfigureGrafika(this IServiceCollection services, IConfiguration configuration)
        {
            configuration.GetSection("Grafika").Bind(AppEnvironment.Default);

            services
                .AddSingleton<IOptions<ServerConfiguration>>(new OptionsWrapper<ServerConfiguration>(AppEnvironment.Default.Server))
                .AddSingleton<IOptions<ClientConfiguration>>(new OptionsWrapper<ClientConfiguration>(AppEnvironment.Default.Client))
                .AddSingleton<IOptions<ContentConfiguration>>(new OptionsWrapper<ContentConfiguration>(AppEnvironment.Default.Content))
                .AddSingleton<IOptions<AuthConfiguration>>(new OptionsWrapper<AuthConfiguration>(AppEnvironment.Default.Auth))
                .AddSingleton<IOptions<DataConfiguration>>(new OptionsWrapper<DataConfiguration>(AppEnvironment.Default.Data))
                .AddSingleton<IOptions<EmailConfiguration>>(new OptionsWrapper<EmailConfiguration>(AppEnvironment.Default.Email))
                .AddSingleton<IOptions<AwsOAuthProviderConfiguration>>(new OptionsWrapper<AwsOAuthProviderConfiguration>(AppEnvironment.Default.Auth.Aws))
                .AddSingleton<IOptions<GoogleOAuthProviderConfiguration>>(new OptionsWrapper<GoogleOAuthProviderConfiguration>(AppEnvironment.Default.Auth.Google))
                .AddSingleton<IOptions<FacebookOAuthProviderConfiguration>>(new OptionsWrapper<FacebookOAuthProviderConfiguration>(AppEnvironment.Default.Auth.Facebook))
                .AddSingleton<IOptions<DisqusOAuthProviderConfiguration>>(new OptionsWrapper<DisqusOAuthProviderConfiguration>(AppEnvironment.Default.Auth.Disqus))
                .AddSingleton<IOptions<JwtConfiguration>>(new OptionsWrapper<JwtConfiguration>(AppEnvironment.Default.Auth.Jwt));
                ;
        }
    }
}
