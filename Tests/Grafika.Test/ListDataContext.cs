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

        public InMemoryDataContext()
        {
            Animations = new InMemoryDataSet<Animation>();
            Users = new InMemoryDataSet<User>();
        }

        public IDataSet<IEntity> Set<IEntity>() where IEntity : class
        {
            if (typeof(IEntity) == typeof(Animation))
                return (IDataSet<IEntity>)Animations;
            if (typeof(IEntity) == typeof(User))
                return (IDataSet<IEntity>)Users;

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
