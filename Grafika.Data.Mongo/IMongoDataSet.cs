using MongoDB.Driver;
using System.Threading.Tasks;

namespace Grafika.Data.Mongo
{
    public interface IMongoDataSet<TEntity> : IDataSet<TEntity>
        where TEntity : class
    {
        IMongoCollection<TEntity> Collection { get; }

        Task EnsureIndex();
    }
}
