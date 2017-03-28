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
            IQueryable<User> query = _dataContext.Users;

            if (!string.IsNullOrEmpty(options.Term))
                return await _textSearchProvider.TextSearchAsync(_dataContext.Users, options);

            if (!string.IsNullOrEmpty(options.Id))
                query = query.Where(q => q.Id == options.Id);
            if (!string.IsNullOrEmpty(options.Email))
                query = query.Where(q => q.Email == options.Email);
            if (!string.IsNullOrEmpty(options.Username))
                query = query.Where(q => q.Username == options.Username);

            return query;
        }
    }
}
