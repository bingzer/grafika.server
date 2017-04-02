using System.ComponentModel.DataAnnotations;

namespace Grafika.Web.Models
{
    public class CheckUsernameModel
    {
        [Required]
        public string Username { get; set; }

        public string Email { get; set; }
    }
}
