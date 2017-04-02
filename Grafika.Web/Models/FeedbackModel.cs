using System.ComponentModel.DataAnnotations;

namespace Grafika.Web.Models
{
    public class FeedbackModel
    {
        public string Category { get; set; }
        [Required]
        public string Subject { get; set; }
        public string Email { get; set; }
        [Required]
        public string Content { get; set; }
    }
}
