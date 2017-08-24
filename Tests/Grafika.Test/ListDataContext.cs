using Grafika.Data;
using System;
using System.Text;
using Grafika.Animations;

namespace Grafika.Test
{
    class InMemoryDataContext : IDataContext
    {
        public IDataSet<Animation> Animations { get; private set; }
        public IDataSet<Background> Backgrounds { get; private set; }
        public IDataSet<Series> Series { get; private set; }
        public IDataSet<User> Users { get; private set; }

        public InMemoryDataContext()
        {
            Animations = new InMemoryDataSet<Animation>();
            Backgrounds = new InMemoryDataSet<Background>();
            Series = new InMemoryDataSet<Series>();
            Users = new InMemoryDataSet<User>();
        }

        public IDataSet<TEntity> Set<TEntity>() where TEntity : class, IEntity
        {
            if (typeof(TEntity) == typeof(Animation))
                return (IDataSet<TEntity>)Animations;
            if (typeof(TEntity) == typeof(Background))
                return (IDataSet<TEntity>)Backgrounds;
            if (typeof(TEntity) == typeof(Series))
                return (IDataSet<TEntity>)Series;
            if (typeof(TEntity) == typeof(User))
                return (IDataSet<TEntity>)Users;

            throw new NotImplementedException("Not implemented " + typeof(TEntity));
        }

        public void Dispose()
        {
            // do nothing
        }

        public bool ValidateId(string id)
        {
            return string.IsNullOrEmpty(id);
        }
    }
}
