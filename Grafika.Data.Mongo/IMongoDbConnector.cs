using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Grafika.Data.Mongo
{
    public interface IMongoDbConnector
    {
        string DatabaseName { get; }
        IMongoClient Client { get; }

        IMongoDatabase GetDatabase();
    }
}
