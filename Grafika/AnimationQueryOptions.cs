using System.Collections.Generic;

namespace Grafika
{
    public class AnimationQueryOptions : SearchQueryOptions
    {
        public const string SortByViews = "views";
        public const string SortByLastModified = "lastModified";
        public const string SortByRatings = "rating";

        public IEnumerable<string> Ids { get; set; }

        public string UserId { get; set; }
        public string SeriesId { get; set; }
        public bool? IsRemoved { get; set; }
        public bool? IsPublic { get; set; }

        public bool? IsRandom { get; set; }
        public string RelatedToAnimationId { get; set; }

        public int? MinimumFrames { get; set; }

        public static AnimationQueryOptions MyAnimations(AnimationQueryOptions options)
        {
            // -- My Animations
            if (!options.IsRemoved.HasValue)
                options.IsRemoved = false;
            return options;
        }

        public static AnimationQueryOptions PublicAnimations(AnimationQueryOptions options)
        {
            // -- Public animations defaults
            if (!options.IsPublic.HasValue)
                options.IsPublic = true;
            if (!options.IsRemoved.HasValue)
                options.IsRemoved = false;
            if (!options.MinimumFrames.HasValue)
                options.MinimumFrames = 1;

            return options;
        }
    }
}
