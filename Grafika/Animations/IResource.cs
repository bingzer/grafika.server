using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace Grafika.Animations
{
    public interface IResource
    {
        [BsonElement("id")]
        string Id { get; }

        [BsonElement("type")]
        string Type { get; }

        [BsonElement("mime")]
        [JsonProperty("mime")]
        string ContentType { get; }
    }
}
