namespace Grafika.WebSite.ViewModels
{
    public class PasswordFormViewModel
    {
        public bool RequiresCurrentPassword { get; set; }
        public string ApiPasswordUrl { get; set; }

        public string Hash { get; set; }
        public string User { get; set; }
    }
}
