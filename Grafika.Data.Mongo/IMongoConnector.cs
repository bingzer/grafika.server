using MongoDB.Driver;

namespace Grafika.Data.Mongo
{
    public interface IMongoConnector
    {
        string DatabaseName { get; }
        IMongoClient Client { get; }

        IMongoDatabase GetDatabase();
    }
}
