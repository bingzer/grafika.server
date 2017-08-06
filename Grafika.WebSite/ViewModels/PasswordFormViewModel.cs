namespace Grafika.WebSite.ViewModels
{
    public class PasswordFormViewModel : RerouteViewModel
    {
        public bool RequiresCurrentPassword { get; set; }
        public string ApiPasswordUrl { get; set; }
    }
}
