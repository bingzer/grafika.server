using Grafika.Configurations;
using Grafika.Data.Mongo;
using Grafika.Data.Providers;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

namespace Grafika.Data
{
    public static class DependencyInjections
    {
        public static void AddServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddScoped<IDataContext, MongoDbContext>();
            serviceCollection.AddSingleton<IMongoDbConnector>((provider) =>
            {
                var env = provider.GetService<AppEnvironment>();
                var mongoClient = new MongoClient(env.Data.ConnectionString);

                return new MongoDbConnector(mongoClient, env.Data.Name);
            });
        }

    }
}
