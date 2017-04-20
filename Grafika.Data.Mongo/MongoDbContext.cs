using Grafika.Animations;
using Grafika.Data.Mongo.DataSets;
using MongoDB.Bson;
using MongoDB.Driver;
using System;

namespace Grafika.Data.Mongo
{
    public sealed class MongoDbContext : IMongoDataContext
    {
        private readonly IMongoDatabase _db;

        public IDataSet<Animation> Animations { get; private set; }
        public IDataSet<User> Users { get; private set; }
        public IDataSet<Background> Backgrounds { get; private set; }

        public MongoDbContext(IMongoDbConnector dbConnector)
        {
            _db = dbConnector.GetDatabase();

            Animations = new AnimationDataSet(_db);
            Backgrounds = new BackgroundDataSet(_db);
            Users = new UserDataSet(_db);
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
            if (typeof(IEntity) == typeof(Background))
                return (IDataSet<IEntity>) Backgrounds;

            throw new NotImplementedException("Not implemented " + typeof(IEntity));
        }

        public void Dispose()
        {
            // do nothing
        }
    }
}
