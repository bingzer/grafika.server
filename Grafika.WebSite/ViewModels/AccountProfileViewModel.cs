namespace Grafika.WebSite.ViewModels
{
    public class AccountProfileViewModel
    {
        public string ApiSaveProfileUrl { get; set; }
        public string ApiPasswordUrl { get; set; }

        public User User { get; set; }

        public string Email => User.Email;
        public string FirstName => User.FirstName;
        public string LastName => User.LastName;
        public string Username => User.Username;

        public UserOAuth Google => User?.Google;
        public UserOAuth Facebook => User?.Facebook;
        public UserPreference Prefs => User?.Prefs;
        public UserSubscriptions Subscriptions => User?.Subscriptions;
        public UserLocal Local => User?.Local;

        public bool HasLocalAccount => Local?.IsRegistered == true;
    }
}
