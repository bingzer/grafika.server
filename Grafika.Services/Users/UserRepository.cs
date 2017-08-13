using Grafika.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.Services.Users
{
    public class UserRepository : RepositoryBase<IDataContext, User, UserQueryOptions>, IUserRepository
    {
        private readonly ITextSearchProvider<User, UserQueryOptions> _textSearchProvider;

        public UserRepository(IDataContext dataContext, ITextSearchProvider<User, UserQueryOptions> textSearchProvider) 
            : base(dataContext)
        {
            _textSearchProvider = textSearchProvider;
        }

        public async Task CheckUsernameAvailability(User user, string username)
        {
            var owner = await First(new UserQueryOptions { Username = username });
            if (owner != null && owner.Id != user.Id)
                throw new NotValidException("Username is taken");
        }

        protected override async Task<IEnumerable<User>> Query(UserQueryOptions options = null)
        {
            IQueryable<User> query = DataContext.Users;

            if (!string.IsNullOrEmpty(options.Term))
                return await _textSearchProvider.TextSearchAsync(DataContext.Users, options);

            if (!string.IsNullOrEmpty(options.Id))
                query = query.Where(q => q.Id == options.Id);
            if (!string.IsNullOrEmpty(options.Email))
                query = query.Where(q => q.Email == options.Email);
            if (!string.IsNullOrEmpty(options.Username))
                query = query.Where(q => q.Username == options.Username);
            if (!string.IsNullOrEmpty(options.IdOrUsername))
                query = query.Where(q => q.Id == options.IdOrUsername || q.Username == options.IdOrUsername);

            return query;
        }

        protected override Task<IEnumerable<User>> OrderBy(IEnumerable<User> query, UserQueryOptions options = null)
        {
            var sortOptions = options.Sort;

            switch (sortOptions?.Name)
            {
                case "lastSeen" when sortOptions.Direction == SortDirection.Ascending:
                    query = query.OrderBy(u => u.Stats?.DateLastSeen);
                    break;
                case "lastSeen" when sortOptions.Direction == SortDirection.Descending:
                    query = query.OrderByDescending(u => u.Stats?.DateLastSeen);
                    break;
                default:
                    query = query.OrderBy(u => u.Id);
                    break;
            }

            return Task.FromResult(query);
        }
    }
}
