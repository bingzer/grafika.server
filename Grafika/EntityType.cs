using System.ComponentModel.DataAnnotations;

namespace Grafika
{
    public enum EntityType
    {
        [Display(Name = "Animation", GroupName = "animations")]
        Animation = 0,
        [Display(Name = "Background", GroupName = "backgrounds")]
        Background = 1
    }
}
