using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Data.Mongo
{
    public interface IMongoDbConnector
    {
        string DatabaseName { get; }
        IMongoClient Client { get; }

        IMongoDatabase GetDatabase();
    }
}
