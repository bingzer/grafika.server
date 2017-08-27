using System.Collections.Generic;
using Grafika.Data;
using System.Threading.Tasks;
using MongoDB.Driver;
using Grafika.Data.Mongo.Supports;

namespace Grafika.Services.Users.Mongo
{
    class UserTextSearchProvider : ITextSearchProvider<User, UserQueryOptions>
    {
        public async Task<IEnumerable<User>> TextSearchAsync(IDataSet<User> dataSet, UserQueryOptions options)
        {
            var filter = Builders<User>.Filter.Text(options.Term, new TextSearchOptions { CaseSensitive = false });

            if (!string.IsNullOrEmpty(options.Id))
                filter &= Builders<User>.Filter.Eq(user => user.Id, options.Id);
            if (!string.IsNullOrEmpty(options.Email))
                filter &= Builders<User>.Filter.Eq(user => user.Email, options.Email);
            if (!string.IsNullOrEmpty(options.Username))
                filter &= Builders<User>.Filter.Eq(user => user.Username, options.Username);
            if (!string.IsNullOrEmpty(options.IdOrUsername))
                filter &= Builders<User>.Filter.Or(
                        Builders<User>.Filter.Eq(user => user.Id, options.IdOrUsername),
                        Builders<User>.Filter.Eq(user => user.Username, options.IdOrUsername)
                    );

            var skip = (options.PageNumber - 1) * options.PageSize;
            var findFluent = dataSet.ToMongoDataSet().Collection
                .Find(filter)
                .Skip(skip)
                .Limit(options.PageSize)
                .SortByDescending(anim => anim.DateModified);

            var users = await findFluent.ToListAsync();

            return new StaticPaging<User>(users, options);
        }
    }
}
