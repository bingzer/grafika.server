using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IEntityService<TEntity, TQueryOptions> : IService
        where TEntity : class, IEntity
        where TQueryOptions : QueryOptions, new()
    {
        Task<IEnumerable<TEntity>> List(TQueryOptions options);
        Task<TEntity> Get(string entityId);
        Task<TEntity> Create(TEntity entity);
        Task<TEntity> Update(TEntity entity);
        Task<TEntity> Delete(string entityId);

    }
}
