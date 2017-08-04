namespace Grafika.WebSite.ViewModels
{
    public class PasswordSetViewModel
    {
        public bool RequiresCurrentPassword { get; set; }
        public string ApiPasswordUrl { get; set; }

        public string Hash { get; set; }
        public string Email { get; set; }
    }
}
