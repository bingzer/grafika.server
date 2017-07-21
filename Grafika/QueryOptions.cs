using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Grafika
{
    public class QueryOptions : IPaging
    {
        public virtual string Id { get; set; }

        [Range(0, int.MaxValue)]
        public virtual int PageNumber { get; set; } = 1;
        
        [Range(0, int.MaxValue)]
        public virtual int PageSize { get; set; } = 25;

        /// <summary>
        /// A template name
        /// </summary>
        public virtual string TemplateName { get; set; }

        /// <summary>
        /// Sort Options
        /// </summary>
        public virtual SortOptions Sort { get; set; }

        /// <summary>
        /// Paginate using skip/limit style
        /// </summary>
        /// <param name="skip"></param>
        /// <param name="limit"></param>
        /// <returns></returns>
        public QueryOptions SetPaging(int? skip, int? limit)
        {
            if (limit != null)
                PageSize = limit.Value;
            if (skip != null)
            {
                PageNumber = ((skip.Value) / PageSize) + 1;
                if (PageNumber < 1)
                    PageNumber = 1;
            }

            return this;
        }

        public QueryOptions NextPage()
        {
            PageNumber++;
            return this;
        }
    }

    public class SearchQueryOptions : QueryOptions
    {
        public virtual string Term { get; set; }
    }
}
