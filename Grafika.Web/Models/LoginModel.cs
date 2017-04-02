using System.ComponentModel.DataAnnotations;

namespace Grafika.Web.Models
{
    public class LoginModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

        /// <summary>
        /// Alias for email,
        /// other app may use this field instead of email
        /// </summary>
        public string Username { get => Email; set => Email = value; }
    }
}
