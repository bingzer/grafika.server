using Grafika.Animations;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IResourceService : IService
    {
        Task<string> GetResourceUrl(string animationId, string resourceId);
        Task<ISignedUrl> CreateResource(string animationId, IResource resource);
        Task<bool> HasResource(string animationId, string resourceId);
        Task<bool> DeleteResource(string animationId, string resourceId);
    }
}
