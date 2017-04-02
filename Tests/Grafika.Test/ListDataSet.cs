using Grafika.Data;
using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Grafika.Test
{
    class InMemoryDataSet<TEntity> : IDataSet<TEntity>
        where TEntity : class, IEntity
    {
        private readonly IList<TEntity> _list = new List<TEntity>();
        public Type ElementType => _list.AsQueryable().ElementType;
        public Expression Expression => _list.AsQueryable().Expression;
        public IQueryProvider Provider => _list.AsQueryable().Provider;

        public Task<TEntity> AddAsync(TEntity entity)
        {
            _list.Add(entity);
            return Task.FromResult(entity);
        }

        public TEnumerable As<TEnumerable>()
        {
            throw new NotImplementedException();
        }

        public Task<TEntity> FindAsync(TEntity entity)
        {
            return Task.FromResult(this.FirstOrDefault(e => e.Id == entity.Id));
        }

        public async Task<TEntity> RemoveAsync(TEntity entity)
        {
            var entityToRemove = await FindAsync(entity);
            _list.Remove(entityToRemove);
            return entity;
        }

        public async Task<TEntity> UpdateAsync(TEntity entity)
        {
            var index = _list.IndexOf(await FindAsync(entity));
            _list[index] = entity;
            return entity;
        }

        public IEnumerator<TEntity> GetEnumerator()
        {
            return _list.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return _list.GetEnumerator();
        }
    }
}
