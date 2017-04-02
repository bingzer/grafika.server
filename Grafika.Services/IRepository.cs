using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IRepository : IDisposable
    {

    }


    public interface IQueryableRepository<TEntity, TQueryOptions> : IRepository
        where TEntity : class, IEntity
        where TQueryOptions : QueryOptions, new()
    {
        /// <summary>
        /// Returns the first result that matches the options
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        Task<TEntity> First(TQueryOptions options = default(TQueryOptions));

        /// <summary>
        /// Returns true if there's a result matches the query options
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        Task<bool> Any(TQueryOptions options = default(TQueryOptions));

        /// <summary>
        /// Returns all results that matches the options
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        Task<IEnumerable<TEntity>> Find(TQueryOptions options = default(TQueryOptions));
    }


    public interface IRepository<TEntity, TQueryOptions> 
        : IQueryableRepository<TEntity, TQueryOptions>
        where TEntity : class, IEntity
        where TQueryOptions : QueryOptions, new()
    {
        bool ValidateId(string id);
        Task<TEntity> Add(TEntity entity);
        Task<TEntity> Update(TEntity entity);
        Task<TEntity> Remove(TEntity entity);
    }
}
