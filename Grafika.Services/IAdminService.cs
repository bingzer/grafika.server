using Grafika.Animations;
using Grafika.Configurations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAdminService
    {
        Task<ServerInfo> GetServerInfo();
        Task<IEnumerable<User>> GetUsers(UserQueryOptions options);
        Task<IEnumerable<Animation>> GetAnimations(AnimationQueryOptions options);

        Task ReverifyUser(string userId);
        Task ResetUserPassword(string userId);
        Task ActivateUser(string userId);
        Task InactivateUser(string userId);
    }
}
