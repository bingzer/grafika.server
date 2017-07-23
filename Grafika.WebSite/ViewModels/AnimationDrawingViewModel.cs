using Grafika.Animations;

namespace Grafika.WebSite.ViewModels
{
    public class AnimationDrawingViewModel
    {
        public Animation Animation { get; set; }
        public bool IsNew => Animation == null;
    }
}
