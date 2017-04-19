using System.Threading.Tasks;
using Grafika.Animations;

namespace Grafika.Services.Animations
{
    class ResourceService : Service, IResourceService
    {
        private IAwsResourceRepository _resRepo;
        private IAnimationService _animationService;

        public ResourceService(IServiceContext serviceContext,
            IAnimationService animationService,
            IAwsResourceRepository resRepo) 
            : base(serviceContext)
        {
            _animationService = animationService;
            _resRepo = resRepo;
        }

        public Task<string> GetResourceUrl(string animationId, string resourceId)
        {
            return _resRepo.GetResourceUrl(animationId, resourceId);
        }

        public Task<bool> HasResource(string animationId, string resourceId)
        {
            return _resRepo.HasResource(animationId, resourceId);
        }

        public async Task<ISignedUrl> CreateResource(string animationId, IResource resource)
        {
            var animation = await _animationService.Get(animationId);
            return await _resRepo.CreateSignedUrl(animation, resource.Id, resource.ContentType);
        }

        public async Task<bool> DeleteResource(string animationId, string resourceId)
        {
            var animation = await _animationService.Get(animationId);
            return await _resRepo.DeleteResource(animationId, resourceId);
        }
    }
}
