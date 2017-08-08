using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.WebSite.ViewModels
{
    public class AnimationCreateViewModel
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
