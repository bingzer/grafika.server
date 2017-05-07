namespace Grafika
{
    public class AnimationQueryOptions : SearchQueryOptions
    {
        public string UserId { get; set; }
        public bool? IsRemoved { get; set; }
        public bool? IsPublic { get; set; }

        public bool? IsRandom { get; set; }
        public string RelatedToAnimationId { get; set; }

        public int? MinimumFrames { get; set; }
    }
}
