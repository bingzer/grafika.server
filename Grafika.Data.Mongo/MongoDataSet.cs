using MongoDB.Driver;
using System.Linq;
using System.Threading.Tasks;
using System;
using Grafika.Utilities;

namespace Grafika.Data.Mongo
{
    public class MongoDataSet<TEntity> : DataSet<TEntity>
        where TEntity : class, IEntity
    {
        private readonly IMongoCollection<TEntity> _collection;

        public MongoDataSet(IMongoCollection<TEntity> collection) 
            : base(collection.AsQueryable())
        {
            _collection = collection;
        }

        public override async Task<TEntity> AddAsync(TEntity entity)
        {
            await _collection.InsertOneAsync(entity, new InsertOneOptions());
            return entity;
        }

        public override async Task<TEntity> FindAsync(TEntity entity)
        {
            Ensure.ArgumentNotNull(entity.Id, nameof(entity.Id));

            var findFluent = await _collection.FindAsync(item => item.Id == entity.Id);
            return await findFluent.FirstAsync();
        }

        public override async Task<TEntity> RemoveAsync(TEntity entity)
        {
            Ensure.ArgumentNotNull(entity.Id, nameof(entity.Id));

            await _collection.DeleteOneAsync(item => item.Id == entity.Id);
            return entity;
        }

        public override async Task<TEntity> UpdateAsync(TEntity entity)
        {
            Ensure.ArgumentNotNull(entity.Id, nameof(entity.Id));

            var updateDefinition = new ObjectPartialUpdateDefinitionBuilder<TEntity>(entity).Build();
            await _collection.UpdateOneAsync(item => item.Id == entity.Id, updateDefinition);

            return entity;
        }

        public override TEnumerable As<TEnumerable>()
        {
            if (typeof(TEnumerable) == typeof(IMongoCollection<TEntity>))
                return (TEnumerable) _collection;
            throw new NotImplementedException();
        }
    }
}
