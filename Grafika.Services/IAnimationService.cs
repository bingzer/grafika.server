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

        Task IncrementViewCount(string animationId);
        Task SubmitRating(string animationId, int rating);
    }
}
