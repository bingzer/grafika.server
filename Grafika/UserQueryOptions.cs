namespace Grafika
{
    public class UserQueryOptions : SearchQueryOptions
    {
        public const string SortByLastSeen = "lastSeen";
        public const string SortById = "_id";

        public string Username { get; set; }
        public string Email { get; set; }

        public string IdOrUsername { get; set; }
    }
}
