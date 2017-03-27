using Grafika.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services.Providers
{
    public interface ITextSearchProvider<TEntity, TQueryOptions>
        where TEntity : class, IEntity
        where TQueryOptions : SearchQueryOptions, new()
    {
        Task<IEnumerable<TEntity>> TextSearchAsync(IDataSet<TEntity> dataset, TQueryOptions options);
    }
}
