using Grafika.Data;
using System;
using System.Text;
using Grafika.Animations;

namespace Grafika.Test
{
    class InMemoryDataContext : IDataContext
    {
        public IDataSet<Animation> Animations { get; private set; }
        public IDataSet<User> Users { get; private set; }
        public IDataSet<Background> Backgrounds { get; private set; }

        public InMemoryDataContext()
        {
            Animations = new InMemoryDataSet<Animation>();
            Users = new InMemoryDataSet<User>();
            Backgrounds = new InMemoryDataSet<Background>();
        }

        public IDataSet<IEntity> Set<IEntity>() where IEntity : class
        {
            if (typeof(IEntity) == typeof(Animation))
                return (IDataSet<IEntity>)Animations;
            if (typeof(IEntity) == typeof(User))
                return (IDataSet<IEntity>)Users;
            if (typeof(IEntity) == typeof(Background))
                return (IDataSet<IEntity>)Backgrounds;

            throw new NotImplementedException("Not implemented " + typeof(IEntity));
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
