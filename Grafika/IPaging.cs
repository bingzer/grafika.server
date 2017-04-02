using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Grafika
{
    public interface IPaging
    {
        int PageNumber { get; }
        int PageSize { get; }
    }

    public interface IPaging<TEntity> : IReadOnlyList<TEntity>, IEnumerable<TEntity>, IEnumerable, IPaging
        where TEntity : class
    {
    }

    public class Paging<TEntity> : List<TEntity>, IPaging<TEntity>, IEnumerable<TEntity>
        where TEntity : class
    {
        public int PageNumber { get; private set; }
        public int PageSize { get; private set; }

        public Paging(IEnumerable<TEntity> source, QueryOptions options)
            : this(source, options.PageNumber, options.PageSize)
        {
        }

        public Paging(IEnumerable<TEntity> source, int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;

            Func<IEnumerable<TEntity>> GenerateSubset = () => {
                if (PageSize == -1)
                    return source;
                if (PageNumber == 1)
                    return source.Skip(0).Take(PageSize).ToList();
                return source.Skip((PageNumber - 1) * PageSize).Take(PageSize).ToList();
            };

            AddRange(GenerateSubset());
        }
    }

    public class StaticPaging<TEntity> : List<TEntity>, IPaging<TEntity>, IEnumerable<TEntity>
        where TEntity : class
    {
        public int PageNumber { get; private set; }
        public int PageSize { get; private set; }

        public StaticPaging(IEnumerable<TEntity> source, QueryOptions options)
        {
            PageNumber = options.PageNumber;
            PageSize = options.PageSize;
            AddRange(source);
        }

    }
}
