using Grafika.Animations;

namespace Grafika.WebSite.ViewModels
{
    public class AnimationPlayerViewModel
    {
        public string AnimationId { get; set; }
        public string TemplateName { get; set; } = "~/Views/Animations/_Player.cshtml";
        public bool? AutoPlay { get; set; } = false;

        public Animation Animation { get; set; }
    }
}
