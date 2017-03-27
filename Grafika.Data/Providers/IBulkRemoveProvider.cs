using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Data.Providers
{
    public interface IBulkRemoveProvider<TEntity>
        where TEntity : class, IEntity
    {
        Task BulkRemove(IDataSet<TEntity> dataset, IEnumerable<string> idsToRemove);
    }
}
