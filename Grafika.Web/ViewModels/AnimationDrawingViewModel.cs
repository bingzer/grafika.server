using Grafika.Animations;

namespace Grafika.Web.ViewModels
{
    public class AnimationDrawingViewModel
    {
        public Animation Animation { get; set; }
        public bool IsNew => Animation == null;
        public string DrawingControllerName { get; set; } = "DrawingController";
    }
}
