using Grafika.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public abstract class EntityService<TEntity, TQueryOptions, TRepository> : Service, IEntityService<TEntity, TQueryOptions>
        where TRepository : IRepository<TEntity, TQueryOptions>
        where TEntity : class, IEntity
        where TQueryOptions : QueryOptions, new()
    {
        protected readonly TRepository Repository;
        protected readonly IEntityValidator<TEntity> Validator;
        protected readonly IEntityIdValidator EntityIdValidator;

        protected EntityService(IServiceContext context, 
            TRepository repository,
            IEntityValidator<TEntity> validator)
            : base(context)
        {
            Repository = repository;
            Validator = validator;
        }

        public virtual async Task<IEnumerable<TEntity>> List(TQueryOptions options)
        {
            var list = await Repository.Find(options);
            foreach (var item in list)
            {
                Validator.Sanitize(item, User);
            }

            return list;
        }

        public virtual async Task<TEntity> Get(string entityId)
        {
            var entity = await GetById(entityId);

            Validator.Sanitize(entity, User);

            return entity;
        }

        public virtual Task<TEntity> Create(TEntity entity)
        {
            Ensure.ArgumentNotNull(entity, "entity");

            Validator.Validate(entity);

            return Repository.Add(entity);
        }

        public virtual async Task<TEntity> Update(TEntity entity)
        {
            Ensure.ArgumentNotNull(entity, "entity");

            var update = await CreateEntityForUpdate(entity);
            return await Repository.Update(update);
        }

        public virtual async Task<TEntity> Delete(string entityId)
        {
            var entity = await GetById(entityId);
            return await Repository.Remove(entity);
        }

        protected virtual async Task<TEntity> GetById(string entityId)
        {
            if (!Validator.ValidateId(entityId))
                throw new NotFoundExeption();

            var entity = await Repository.First(new TQueryOptions { Id = entityId });
            if (entity == null)
                throw new NotFoundExeption();

            return entity;
        }

        protected internal abstract Task<TEntity> CreateEntityForUpdate(TEntity source);
    }
}
