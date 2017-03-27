namespace Grafika.Services.Models
{
    public class BaseEmailModel
    {
        public string Email { get; set; }
        public string Sender { get; set; }

        public string Subject { get; set; }

        public string HomeUrl { get; set; }
        public string PrivacyUrl { get; set; }
    }
}
