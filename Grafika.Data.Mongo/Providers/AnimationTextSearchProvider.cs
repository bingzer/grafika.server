using Grafika.Animations;
using Grafika.Data.Mongo.Supports;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.Data.Mongo.Providers
{
    class AnimationTextSearchProvider : ITextSearchProvider<Animation, AnimationQueryOptions>
    {
        public async Task<IEnumerable<Animation>> TextSearchAsync(IDataSet<Animation> dataSet, AnimationQueryOptions options)
        {
            var filter = Builders<Animation>.Filter.Text(options.Term, new TextSearchOptions { CaseSensitive = false });

            if (!string.IsNullOrEmpty(options.Id))
                filter &= Builders<Animation>.Filter.Eq(anim => anim.Id, options.Id);
            if (options.Ids != null && options.Ids.Any())
                filter &= Builders<Animation>.Filter.In(anim => anim.Id, options.Ids);
            if (!string.IsNullOrEmpty(options.UserId))
                filter &= Builders<Animation>.Filter.Eq(anim => anim.UserId, options.UserId);
            if (options.IsPublic.HasValue)
                filter &= Builders<Animation>.Filter.Eq(anim => anim.IsPublic, options.IsPublic);
            if (options.IsRemoved.HasValue)
                filter &= Builders<Animation>.Filter.Eq(anim => anim.IsRemoved, options.IsRemoved);

            var skip = (options.PageNumber - 1) * options.PageSize;
            var animations = await dataSet.ToMongoDataSet().Collection
                .Find(filter)
                .Skip(skip)
                .Limit(options.PageSize)
                .OrderBy(options.Sort)
                .ToListAsync();

            return new StaticPaging<Animation>(animations, options);
        }
    }
}
