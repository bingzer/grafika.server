using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Grafika.Web.Models
{
    public class PasswordModel
    {
        [Required]
        [JsonProperty("newPwd")]
        public string Password { get; set; }
        [JsonProperty("currPwd")]
        public string CurrentPassword { get; set; }
    }
}
