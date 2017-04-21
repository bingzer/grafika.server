using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Connections;
using Grafika.Data.Mongo.Providers;
using Grafika.Services.Users.Mongo;
using Grafika.Utilities;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using System;

namespace Grafika.Data.Mongo
{
    public static class Setups
    {
        public static void AddMongoDb(this IServiceCollection services)
        {
            services.AddSingleton<IMongoConnector>((provider) =>
            {
                var env = provider.Get<AppEnvironment>();
                var mongoClient = new MongoClient(env.Data.ConnectionString);

                return new MongoConnector(mongoClient, env.Data.Name);
            });

            services
                .AddScoped<IDataContext, MongoDataContext>()
                .AddScoped<IMongoDataContext, MongoDataContext>()
                .AddScoped<ITextSearchProvider<Animation, AnimationQueryOptions>, AnimationTextSearchProvider>()
                .AddScoped<IBulkRemoveProvider<Animation>, AnimationBulkRemoveProvider>()
                .AddScoped<ITextSearchProvider<Background, BackgroundQueryOptions>, BackgroundTextSearchProvider>()
                .AddScoped<IBulkRemoveProvider<Background>, BackgroundBulkRemoveProvider>()
                .AddScoped<ITextSearchProvider<User, UserQueryOptions>, UserTextSearchProvider>()
                .AddSingleton<IMongoConnectionHub, MongoConnectionHub>()
                .AddSingleton<IEntityIdValidator, MongoEntityIdValidator>()
                ;
        }

        public static void UseMongoDb(this IServiceProvider serviceProvider)
        {
            serviceProvider.Get<IConnectionManager>().Register<IMongoConnectionHub>();
        }

    }
}
