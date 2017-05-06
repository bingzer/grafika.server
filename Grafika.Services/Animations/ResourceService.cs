using System.Threading.Tasks;
using Grafika.Animations;

namespace Grafika.Services.Animations
{
    class ResourceService : Service, IResourceService
    {
        private IAwsResourceRepository _resRepo;

        public ResourceService(IServiceContext serviceContext,
            IAwsResourceRepository resRepo) 
            : base(serviceContext)
        {
            _resRepo = resRepo;
        }

        public Task<string> GetResourceUrl(EntityType entityType, string animationId, string resourceId)
        {
            return _resRepo.GetResourceUrl(entityType, animationId, resourceId);
        }

        public Task<bool> HasResource(EntityType entityType, string animationId, string resourceId)
        {
            return _resRepo.HasResource(entityType, animationId, resourceId);
        }

        public Task<ISignedUrl> CreateResource(IDrawableEntity entity, IResource resource)
        {
            return _resRepo.CreateSignedUrl(entity, resource.Id, resource.ContentType);
        }

        public Task<bool> DeleteResource(EntityType entityType, string animationId, string resourceId)
        {
            return _resRepo.DeleteResource(entityType, animationId, resourceId);
        }
    }
}
