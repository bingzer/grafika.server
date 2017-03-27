using MongoDB.Driver;
using Grafika.Configurations;

namespace Grafika.Data.Mongo
{
    internal sealed class MongoDbConnector : IMongoDbConnector
    {
        public IMongoClient Client { get; private set; }
        public string DatabaseName { get; private set; }

        public MongoDbConnector(IMongoClient mongoClient, string databaseName)
        {
            Client = mongoClient;
            DatabaseName = databaseName;
        }

        public IMongoDatabase GetDatabase()
        {
            return Client.GetDatabase(DatabaseName);
        }
    }
}
