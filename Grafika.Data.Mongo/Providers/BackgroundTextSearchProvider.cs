using Grafika.Animations;
using Grafika.Data.Mongo.Supports;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Grafika.Data.Mongo.Providers
{
    class BackgroundTextSearchProvider : ITextSearchProvider<Background, BackgroundQueryOptions>
    {
        public async Task<IEnumerable<Background>> TextSearchAsync(IDataSet<Background> dataSet, BackgroundQueryOptions options)
        {
            var filter = Builders<Background>.Filter.Text(options.Term, new TextSearchOptions { CaseSensitive = false });

            if (!string.IsNullOrEmpty(options.Id))
                filter &= Builders<Background>.Filter.Eq(background => background.Id, options.Id);
            if (!string.IsNullOrEmpty(options.UserId))
                filter &= Builders<Background>.Filter.Eq(background => background.UserId, options.UserId);
            if (options.IsPublic.HasValue)
                filter &= Builders<Background>.Filter.Eq(background => background.IsPublic, options.IsPublic);
            if (options.IsRemoved.HasValue)
                filter &= Builders<Background>.Filter.Eq(background => background.IsRemoved, options.IsRemoved);

            var skip = (options.PageNumber - 1) * options.PageSize;
            var backgrounds = await dataSet.ToMongoDataSet().Collection
                .Find(filter)
                .Skip(skip)
                .Limit(options.PageSize)
                .OrderBy(options.Sort)
                .ToListAsync();

            return new StaticPaging<Background>(backgrounds, options);
        }
    }
}
