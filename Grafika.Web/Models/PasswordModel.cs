using System.ComponentModel.DataAnnotations;

namespace Grafika.Web.Models
{
    public class PasswordModel
    {
        [Required]
        public string Password { get; set; }

        public string CurrentPassword { get; set; }
    }
}
