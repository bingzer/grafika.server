using MongoDB.Driver;
using System.Linq;
using System.Threading.Tasks;
using System;
using Grafika.Utilities;

namespace Grafika.Data.Mongo
{
    public abstract class MongoDataSet<TEntity> : DataSet<TEntity>, IMongoDataSet<TEntity>
        where TEntity : class, IEntity
    {
        public IMongoCollection<TEntity> Collection { get; private set; }

        public MongoDataSet(IMongoCollection<TEntity> collection) 
            : base(collection.AsQueryable())
        {
            Collection = collection;
        }

        public override async Task<TEntity> AddAsync(TEntity entity)
        {
            await Collection.InsertOneAsync(entity, new InsertOneOptions());
            return entity;
        }

        public override async Task<TEntity> FindAsync(TEntity entity)
        {
            Ensure.ArgumentNotNull(entity.Id, nameof(entity.Id));

            var findFluent = await Collection.FindAsync(item => item.Id == entity.Id);
            return await findFluent.FirstAsync();
        }

        public override async Task<TEntity> RemoveAsync(TEntity entity)
        {
            Ensure.ArgumentNotNull(entity.Id, nameof(entity.Id));

            await Collection.DeleteOneAsync(item => item.Id == entity.Id);
            return entity;
        }

        public override async Task<TEntity> UpdateAsync(TEntity entity)
        {
            Ensure.ArgumentNotNull(entity.Id, nameof(entity.Id));

            var updateDefinition = new ObjectPartialUpdateDefinitionBuilder<TEntity>(entity).Build();
            await Collection.UpdateOneAsync(item => item.Id == entity.Id, updateDefinition);

            return entity;
        }

        public abstract Task EnsureIndex();
    }
}
