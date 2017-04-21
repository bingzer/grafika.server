using Grafika.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public abstract class RepositoryBase<TDataContext, TEntity, TQueryOptions>
        : IRepository<TEntity, TQueryOptions>
        where TDataContext : IDataContext
        where TEntity : class, IEntity
        where TQueryOptions : QueryOptions, new()
    {
        protected readonly TDataContext DataContext;

        protected RepositoryBase(TDataContext dataContext)
        {
            DataContext = dataContext;
        }

        public async Task<TEntity> Add(TEntity entity)
        {
            return await DataContext.Set<TEntity>().AddAsync(entity);
        }

        public async Task<TEntity> First(TQueryOptions options = default(TQueryOptions))
        {
            var query = await Find(options);
            return query.FirstOrDefault();
        }

        public async Task<bool> Any(TQueryOptions options = null)
        {
            var query = await Find(options);
            return query.Any();
        }

        public async Task<IEnumerable<TEntity>> Find(TQueryOptions options = default(TQueryOptions))
        {
            if (options == default(TQueryOptions))
                options = new TQueryOptions();

            IEnumerable<TEntity> query = await QueryAndOrderBy(options);
            if (!(query is IPaging))
            {
                query = new Paging<TEntity>(query, options);

                options.PageNumber = ((IPaging)query).PageNumber;
                options.PageSize = ((IPaging)query).PageSize;
                //options.PageCount = ((IPaging)query).PageCount;
                //options.TotalCount = ((IPaging)query).TotalCount;
            }

            return query;
        }

        public async Task<TEntity> Remove(TEntity entity)
        {
            return await DataContext.Set<TEntity>().RemoveAsync(entity);
        }

        public async Task<TEntity> Update(TEntity entity)
        {
            return await DataContext.Set<TEntity>().UpdateAsync(entity);
        }

        public void Dispose()
        {
            DataContext.Dispose();
        }

        protected virtual Task<IEnumerable<TEntity>> OrderBy(IEnumerable<TEntity> query, TQueryOptions options = default(TQueryOptions))
        {
            return Task.FromResult(query);
        }

        protected abstract Task<IEnumerable<TEntity>> Query(TQueryOptions options = default(TQueryOptions));

        private async Task<IEnumerable<TEntity>> QueryAndOrderBy(TQueryOptions options = default(TQueryOptions))
        {
            var query = await Query(options);
            return await OrderBy(query, options);
        }
    }
}
