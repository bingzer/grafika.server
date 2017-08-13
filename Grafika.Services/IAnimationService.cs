using Grafika.Animations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAnimationService : IEntityService<Animation, AnimationQueryOptions>
    {
        Task Delete(IEnumerable<string> animationIds);

        Task IncrementViewCount(string animationId);
        Task SubmitRating(string animationId, int rating);
    }
}
