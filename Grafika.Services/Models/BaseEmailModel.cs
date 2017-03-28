namespace Grafika.Services.Models
{
    public class BaseEmailModel
    {
        public virtual string Email { get; set; }
        public virtual string Sender { get; set; }

        public virtual string Subject { get; set; }

        public virtual string HomeUrl { get; set; }
        public virtual string PrivacyUrl { get; set; }
    }
}
