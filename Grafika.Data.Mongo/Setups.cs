using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Data.Mongo.Providers;
using Grafika.Services.Users.Mongo;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

namespace Grafika.Data.Mongo
{
    public static class Setups
    {
        public static void AddMongoDB(this IServiceCollection services)
        {
            services.AddSingleton<IMongoConnector>((provider) =>
            {
                var env = provider.GetService<AppEnvironment>();
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
                .AddSingleton<IEntityIdValidator, MongoEntityIdValidator>()
                ;
        }

    }
}
