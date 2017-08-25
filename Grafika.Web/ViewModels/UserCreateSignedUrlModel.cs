using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Grafika.Web.Models
{
    public class UserCreateSignedUrlModel
    {
        [Required]
        [JsonProperty("imageType")]
        public string ImageType { get; set; }

        [Required]
        [JsonProperty("mime")]
        public string ContentType { get; set; }
    }
}
