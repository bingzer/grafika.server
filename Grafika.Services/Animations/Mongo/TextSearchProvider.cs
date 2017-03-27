using Grafika.Animations;
using Grafika.Data;
using Grafika.Services.Providers;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services.Animations.Mongo
{
    class TextSearchProvider : ITextSearchProvider<Animation, AnimationQueryOptions>
    {
        public async Task<IEnumerable<Animation>> TextSearchAsync(IDataSet<Animation> dataset, AnimationQueryOptions options)
        {
            var filter = Builders<Animation>.Filter.Text(options.Term, new TextSearchOptions { CaseSensitive = false });

            if (!string.IsNullOrEmpty(options.Id))
                filter &= Builders<Animation>.Filter.Eq(anim => anim.Id, options.Id);
            if (!string.IsNullOrEmpty(options.UserId))
                filter &= Builders<Animation>.Filter.Eq(anim => anim.UserId, options.UserId);
            if (options.IsPublic.HasValue)
                filter &= Builders<Animation>.Filter.Eq(anim => anim.IsPublic, options.IsPublic);
            if (options.IsRemoved.HasValue)
                filter &= Builders<Animation>.Filter.Eq(anim => anim.IsRemoved, options.IsRemoved);

            var skip = (options.PageNumber - 1) * options.PageSize;
            var findFluent = dataset.As<IMongoCollection<Animation>>()
                .Find(filter)
                .Skip(skip)
                .Limit(options.PageSize)
                .SortByDescending(anim => anim.DateModified);

            var animations = await findFluent.ToListAsync();

            return new StaticPaging<Animation>(animations, options);
        }
    }
}
