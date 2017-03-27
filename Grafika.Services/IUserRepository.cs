using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IUserRepository : IRepository<User, UserQueryOptions>
    {
        Task CheckUsernameAvailability(User user, string username);
    }
}
