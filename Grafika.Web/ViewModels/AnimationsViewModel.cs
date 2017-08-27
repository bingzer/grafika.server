using Grafika.Animations;
using System.Collections.Generic;
using System.Linq;

namespace Grafika.Web.ViewModels
{
    public class AnimationsViewModel
    {
        public IEnumerable<Animation> Animations { get; set; }
        public AnimationQueryOptions Options { get; set; }
        public bool HasNext => Animations?.Count() == Options.PageSize;
    }
}
