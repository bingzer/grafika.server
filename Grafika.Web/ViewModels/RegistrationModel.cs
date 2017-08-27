using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Grafika.Web.Models
{
    public class RegistrationModel
    {
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }
        /// <summary>
        /// Alias for email,
        /// other app may use this field instead of email
        /// </summary>
        public string Username { get => Email; set => Email = value; }

        public string Password { get; set; }

        public string Hash { get; set; }

        public string FirstName
        {
            get
            {
                if (Name != null)
                {
                    var split = Name.Split(' ');
                    return split[0];
                }
                return null;
            }
        }
        public string LastName
        {
            get
            {
                if (Name != null)
                {
                    var split = Name.Split(' ');
                    if (split.Length > 1)
                        return split[1];
                }
                return null;
            }
        }
    }
}
