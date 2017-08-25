namespace Grafika.Web.ViewModels
{
    public class UserViewModel : AnimationsViewModel
    {
        public User User { get; set; }

        public string AvatarUrl { get; set; }
        public string BackdropUrl { get; set; }
    }
}
