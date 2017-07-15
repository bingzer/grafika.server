using Grafika.Animations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.WebSite.ViewModels
{
    public class AnimationsViewModel
    {
        public IEnumerable<Animation> Animations { get; set; }
        public AnimationQueryOptions Options { get; set; }
    }
}
