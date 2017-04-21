﻿using Grafika.Data;
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

        public IDataSet<TEntity> Set<TEntity>() where TEntity : class, IEntity
        {
            if (typeof(TEntity) == typeof(Animation))
                return (IDataSet<TEntity>)Animations;
            if (typeof(TEntity) == typeof(User))
                return (IDataSet<TEntity>)Users;
            if (typeof(TEntity) == typeof(Background))
                return (IDataSet<TEntity>)Backgrounds;

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
