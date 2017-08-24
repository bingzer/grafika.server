using System.Collections.Generic;
using System.Threading.Tasks;
using Grafika.Data;
using System.Linq;
using Grafika.Animations;

namespace Grafika.Services.AnimationSeries
{
    class SeriesRepository : RepositoryBase<IDataContext, Series, SeriesQueryOptions>, ISeriesRepository
    {
        private readonly ITextSearchProvider<Series, SeriesQueryOptions> _textSearchProvider;

        public SeriesRepository(IDataContext dataContext,
            ITextSearchProvider<Grafika.Animations.Series, SeriesQueryOptions> textSearchProvider) 
            : base(dataContext)
        {
            _textSearchProvider = textSearchProvider;
        }

        protected override async Task<IEnumerable<Series>> Query(SeriesQueryOptions options = null)
        {
            IQueryable<Series> query = DataContext.Series;

            if (!string.IsNullOrEmpty(options.Term))
                return await _textSearchProvider.TextSearchAsync(DataContext.Series, options);

            if (!string.IsNullOrEmpty(options.Id))
                query = query.Where(q => q.Id == options.Id);
            if (!string.IsNullOrEmpty(options.Name))
                query = query.Where(q => q.Name == options.Name);
            if (!string.IsNullOrEmpty(options.UserId))
                query = query.Where(q => q.UserId == options.UserId);
            if (!string.IsNullOrEmpty(options.AnimationId))
                query = query.Where(q => q.AnimationIds.Contains(options.AnimationId));

            return query;
        }
    }
}
