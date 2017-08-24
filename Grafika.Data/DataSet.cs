using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Grafika.Data
{
    public abstract class DataSet<TEntity> 
        : IDataSet<TEntity>
        where TEntity : class, IEntity
    {
        public Type ElementType => _queryable.ElementType;
        public Expression Expression => _queryable.Expression;
        public IQueryProvider Provider => _queryable.Provider;

        protected readonly IQueryable<TEntity> _queryable;

        public DataSet(IQueryable<TEntity> queryable)
        {
            _queryable = queryable;
        }
        
        public abstract Task<TEntity> AddAsync(TEntity entity);        
        public abstract Task<TEntity> FindAsync(TEntity entity);
        public abstract Task<TEntity> RemoveAsync(TEntity entity);        
        public abstract Task<TEntity> UpdateAsync(TEntity entity);

        #region IEnumerable stuffs
        public IEnumerator<TEntity> GetEnumerator()
        {
            return _queryable.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return _queryable.GetEnumerator();
        }
        #endregion
    }
}
