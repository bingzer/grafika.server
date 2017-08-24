using System;

namespace Grafika.Animations
{
    public class Thumbnail : Resource
    {
        public const string ResourceId = "thumbnail";
        public static Thumbnail Create() => new Thumbnail();

        public override string Id => ResourceId;
        public override string Type => ResourceId;
        public override string ContentType => ContentTypes.Png;
    }
}
