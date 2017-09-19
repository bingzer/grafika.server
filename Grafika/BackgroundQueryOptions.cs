namespace Grafika
{
    public class BackgroundQueryOptions : SearchQueryOptions
    {
        public const string SortByLastModified = "lastModified";

        public string UserId { get; set; }
        public bool? IsRemoved { get; set; }
        public bool? IsPublic { get; set; }
    }
}
