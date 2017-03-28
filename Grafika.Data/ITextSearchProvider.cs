using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Data
{
    public interface ITextSearchProvider<TEntity, TQueryOptions>
        where TEntity : class, IEntity
        where TQueryOptions : SearchQueryOptions, new()
    {
        Task<IEnumerable<TEntity>> TextSearchAsync(IDataSet<TEntity> dataset, TQueryOptions options);
    }
}
