using Grafika.Animations;
using MongoDB.Bson;
using MongoDB.Driver;
using System;

namespace Grafika.Data.Mongo
{
    public sealed class MongoDbContext : IDataContext
    {
        private readonly IMongoDatabase _db;

        public IDataSet<Animation> Animations { get; private set; }
        public IDataSet<User> Users { get; private set; }

        public MongoDbContext(IMongoDbConnector dbConnector)
        {
            _db = dbConnector.GetDatabase();

            Animations = new MongoDataSet<Animation>(GetCollection<Animation>("animations"));
            Users = new MongoDataSet<User>(GetCollection<User>("users"));
        }

        public bool ValidateId(string id)
        {
            return ObjectId.TryParse(id, out var oid);
        }

        public IDataSet<IEntity> Set<IEntity>() where IEntity : class
        {
            if (typeof(IEntity) == typeof(Animation))
                return (IDataSet<IEntity>)Animations;
            if (typeof(IEntity) == typeof(User))
                return (IDataSet<IEntity>)Users;

            throw new NotImplementedException("Not implemented " + typeof(IEntity));
        }

        public IMongoCollection<TEntity> GetCollection<TEntity>(string name)
        {
            return _db.GetCollection<TEntity>(name);
        }

        public void Dispose()
        {
            // do nothing
        }
    }
}
