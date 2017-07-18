using Grafika.Animations;
using Grafika.Data.Mongo.Supports;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Data.Mongo.Providers
{
    class SeriesTextSearchProvider : ITextSearchProvider<Series, SeriesQueryOptions>
    {
        public async Task<IEnumerable<Series>> TextSearchAsync(IDataSet<Series> dataSet, SeriesQueryOptions options)
        {
            var filter = Builders<Series>.Filter.Text(options.Term, new TextSearchOptions { CaseSensitive = false });

            if (!string.IsNullOrEmpty(options.Id))
                filter &= Builders<Series>.Filter.Eq(s => s.Id, options.Id);
            if (!string.IsNullOrEmpty(options.AnimationId))
                filter &= Builders<Series>.Filter.AnyEq(s => s.AnimationIds, options.AnimationId);
            if (!string.IsNullOrEmpty(options.UserId))
                filter &= Builders<Series>.Filter.Eq(s => s.UserId, options.UserId);

            var skip = (options.PageNumber - 1) * options.PageSize;
            var series = await dataSet.ToMongoDataSet().Collection
                .Find(filter)
                .Skip(skip)
                .Limit(options.PageSize)
                .OrderBy(options.Sort)
                .ToListAsync();

            return new StaticPaging<Series>(series, options);
        }
    }
}
