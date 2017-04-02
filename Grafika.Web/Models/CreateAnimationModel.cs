using System.ComponentModel.DataAnnotations;

namespace Grafika.Web.Models
{
    public class AnimationCreateModel
    {
        /* {name: "test", isPublic: false, width: 800, height: 450}*/
        [Required]
        public string Name { get; set; }
        [Required]
        public bool? IsPublic { get; set; }
        [Required]
        public int? Width { get; set; }
        [Required]
        public int? Height { get; set; }
    }
}
