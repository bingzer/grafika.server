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
            services.AddSingleton<IMongoDbConnector>((provider) =>
            {
                var env = provider.GetService<AppEnvironment>();
                var mongoClient = new MongoClient(env.Data.ConnectionString);

                return new MongoDbConnector(mongoClient, env.Data.Name);
            });


            services
                .AddScoped<IDataContext, MongoDbContext>()
                .AddScoped<ITextSearchProvider<Animation, AnimationQueryOptions>, AnimationTextSearchProvider>()
                .AddScoped<IBulkRemoveProvider<Animation>, AnimationBulkRemoveProvider>()
                .AddScoped<ITextSearchProvider<User, UserQueryOptions>, UserTextSearchProvider>()
                ;
        }

    }
}
