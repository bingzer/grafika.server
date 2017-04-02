using MongoDB.Bson.Serialization.Attributes;

namespace Grafika.Animations
{
    [BsonIgnoreExtraElements]
    public class Client
    {
        [BsonElement("name")]
        public string Name { get; set; }
        [BsonElement("version")]
        public string Version { get; set; }
        [BsonElement("browser")]
        public string Browser { get; set; }

        public static Client DefaultClient
        {
            get
            {
                return new Client { Name = "Generic" };
            }
        }
    }
}
