using Grafika.Animations;
using Grafika.Data.Mongo.DataSets;
using MongoDB.Driver;
using System;

namespace Grafika.Data.Mongo
{
    public sealed class MongoDataContext : IMongoDataContext
    {
        private readonly IMongoDatabase _db;

        public IDataSet<Animation> Animations { get; private set; }
        public IDataSet<Background> Backgrounds { get; private set; }
        public IDataSet<Series> Series { get; private set; }
        public IDataSet<User> Users { get; private set; }

        public MongoDataContext(IMongoConnector dbConnector)
        {
            _db = dbConnector.GetDatabase();

            Animations = new AnimationDataSet(_db);
            Backgrounds = new BackgroundDataSet(_db);
            Series = new SeriesDataSet(_db);
            Users = new UserDataSet(_db);
        }

        public IDataSet<TEntity> Set<TEntity>() where TEntity : class, IEntity
        {
            if (typeof(TEntity) == typeof(Animation))
                return (IDataSet<TEntity>)Animations;
            if (typeof(TEntity) == typeof(Background))
                return (IDataSet<TEntity>)Backgrounds;
            if (typeof(TEntity) == typeof(Series))
                return (IDataSet<TEntity>)Series;
            if (typeof(TEntity) == typeof(User))
                return (IDataSet<TEntity>)Users;

            throw new NotImplementedException("Not implemented " + typeof(TEntity));
        }

        public void Dispose()
        {
            // do nothing
        }
    }
}
