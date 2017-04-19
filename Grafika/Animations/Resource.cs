using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace Grafika.Animations
{
    public class Resource : IResource
    {
        [BsonElement("id")]
        public virtual string Id { get; set; }

        [BsonElement("type")]
        public virtual string Type { get; set; }

        [BsonElement("mime")]
        [JsonProperty("mime")]
        public virtual string ContentType { get; set; }
    }
}
