namespace Grafika
{
    public class BackgroundQueryOptions : SearchQueryOptions
    {
        public string UserId { get; set; }
        public bool? IsRemoved { get; set; }
        public bool? IsPublic { get; set; }
    }
}
