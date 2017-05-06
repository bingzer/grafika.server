using System.ComponentModel.DataAnnotations;

namespace Grafika
{
    public enum EntityType
    {
        [Display(Name = "Animation", GroupName = "animations")]
        Animation,
        [Display(Name = "Background", GroupName = "backgrounds")]
        Background
    }
}
