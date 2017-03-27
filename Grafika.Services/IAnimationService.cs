using Grafika.Animations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAnimationService : IEntityService<Animation, AnimationQueryOptions>
    {
        /// <summary>
        /// Create animation template
        /// </summary>
        /// <param name="animation"></param>
        /// <returns></returns>
        Task<Animation> PrepareNewAnimation(Animation animation, User user);

        //Task<IEnumerable<Animation>> GetAnimations(AnimationQueryOptions options);
        //Task<Animation> GetAnimation(string animationId);
        //Task<Animation> CreateAnimation(Animation animation);
        //Task<Animation> UpdateAnimation(Animation animation);
        //Task DeleteAnimation(string animationId);

        Task BulkDeleteAnimations(IEnumerable<string> animationIds);

        Task<string> GetAnimationThumbnailUrl(string animationId);
        Task<ISignedUrl> CreateAnimationThumbnailUrl(string animationId);

        Task IncrementViewCount(string animationId);
        Task SubmitRating(string animationId, int rating);

        Task<FrameData> GetFrameData(string animationId, FrameData frameData);
        Task PostFrameData(string animationId, FrameData frameData);
    }
}
