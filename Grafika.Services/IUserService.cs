using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IUserService : IEntityService<User, UserQueryOptions>
    {
        Task<string> GetAvatarOrBackdropUrl(string userId, string type);
        Task<ISignedUrl> CreateSignedUrl(string userId, string imageType, string contentType);
    }
}
