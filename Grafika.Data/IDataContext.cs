using Grafika.Animations;
using System;

namespace Grafika.Data
{
    public interface IDataContext : IDisposable
    {
        IDataSet<Animation> Animations { get; }
        IDataSet<Background> Backgrounds { get; }
        IDataSet<Series> Series { get; }
        IDataSet<User> Users { get; }

        IDataSet<TEntity> Set<TEntity>() where TEntity : class, IEntity;
    }
}
