using Grafika.Animations;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IResourceService : IService
    {
        Task<ISignedUrl> CreateResource(IDrawableEntity entity, IResource resource);
        Task<string> GetResourceUrl(EntityType entityType, string entityId, string resourceId);
        Task<bool> HasResource(EntityType entityType, string entityId, string resourceId);
        Task<bool> DeleteResource(EntityType entityType, string entityId, string resourceId);
    }
}
