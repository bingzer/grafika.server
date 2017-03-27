using Grafika.Animations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAnimationRepository : IRepository<Animation, AnimationQueryOptions>
    {
        Task RemoveByIds(IEnumerable<string> animationIds);
    }
}
