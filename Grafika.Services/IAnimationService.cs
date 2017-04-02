using Grafika.Animations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAnimationService : IEntityService<Animation, AnimationQueryOptions>
    {
        Task BulkDeleteAnimations(IEnumerable<string> animationIds);

        /// <summary>
        /// Create animation template
        /// </summary>
        /// <param name="animation"></param>
        /// <returns></returns>
        Task<Animation> PrepareNewAnimation(Animation animation, User user);

        Task<string> GetThumbnailUrl(string animationId);
        Task<ISignedUrl> CreateThumbnail(string animationId);
        Task<bool> HasThumbnail(string animationId);

        Task IncrementViewCount(string animationId);
        Task SubmitRating(string animationId, int rating);

        Task<FrameData> GetFrameData(string animationId, FrameData frameData);
        Task PostFrameData(string animationId, FrameData frameData);
    }
}
