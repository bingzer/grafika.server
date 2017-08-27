using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.Data
{
    public interface IDataSet<TEntity> 
        : IQueryable<TEntity>, IEnumerable<TEntity>, IQueryable, IEnumerable
        where TEntity : class
    {

        Task<TEntity> AddAsync(TEntity entity);
        
        Task<TEntity> FindAsync(TEntity entity);
        
        Task<TEntity> UpdateAsync(TEntity entity);

        Task<TEntity> RemoveAsync(TEntity entity);
    }
}
