namespace Grafika.Web.ViewModels
{
    public class RerouteViewModel
    {
        public const string ResetPassword = "reset-pwd";
        public const string Verify = "verify";

        public string Action { get; set; }
        public string Hash { get; set; }
        public string User { get; set; }
    }
}
