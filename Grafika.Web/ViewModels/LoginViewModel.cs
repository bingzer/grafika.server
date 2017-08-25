using System.ComponentModel.DataAnnotations;

namespace Grafika.Web.Models
{
    public class LoginViewModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

        public string Token { get; set; }

        /// <summary>
        /// Alias for email,
        /// other app may use this field instead of email
        /// </summary>
        public string Username { get => Email; set => Email = value; }
    }
}
