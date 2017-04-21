using System;
using System.Threading.Tasks;
using MongoDB.Driver;
using Grafika.Animations;

namespace Grafika.Data.Mongo
{
    internal sealed class MongoConnector : IMongoConnector
    {
        public IMongoClient Client { get; private set; }
        public string DatabaseName { get; private set; }

        public MongoConnector(IMongoClient mongoClient, string databaseName)
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
