using Grafika.Animations;
using System.Threading.Tasks;

namespace Grafika.Services.Animations
{
    class FrameService : Service, IFrameService
    {
        private IAnimationService _animationService;
        private IAwsAnimationRepository _frameRepo;

        public FrameService(IServiceContext serviceContext, 
            IAnimationService animationService,
            IAwsAnimationRepository frameRepo) 
            : base(serviceContext)
        {
            _animationService = animationService;
            _frameRepo = frameRepo;
        }

        public async Task<FrameData> GetFrameData(string animationId, FrameData frameData)
        {
            var animation = await _animationService.Get(animationId);
            return await _frameRepo.GetFrameData(animation, frameData);
        }

        public async Task PostFrameData(string animationId, FrameData frameData)
        {
            var animation = await _animationService.Get(animationId);
            await _frameRepo.PostFrameData(animation, frameData);
        }
    }
}
