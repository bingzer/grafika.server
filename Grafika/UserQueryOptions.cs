namespace Grafika
{
    public class UserQueryOptions : SearchQueryOptions
    {
        public string Username { get; set; }
        public string Email { get; set; }

        public string IdOrUsername { get; set; }
    }
}
