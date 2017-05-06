using Grafika.Animations;
using System.IO;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAwsRepository : IRepository
    {

    }

    public interface IAwsFrameRepository : IAwsRepository
    {
        Task PostFrameData(IDrawableEntity entity, FrameData frameData);
        Task<FrameData> GetFrameData(IDrawableEntity entity, FrameData frameData);
    }

    public interface IAwsResourceRepository : IAwsRepository
    {
        Task<ISignedUrl> CreateSignedUrl(IDrawableEntity entity, string resourceId, string contentType);
        Task<string> GetResourceUrl(EntityType entityType, string entityId, string resourceId);
        Task<bool> HasResource(EntityType entityType, string entityId, string resourceId);
        Task<bool> DeleteResource(EntityType entityType, string entityId, string resourceId);
    }

    public interface IAwsUsersRepository : IAwsRepository
    {
        Task<ISignedUrl> CreateSignedUrl(IUser user, string imageType, string contentType);
    }
}
