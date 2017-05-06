using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Grafika.Animations
{
    [BsonIgnoreExtraElements]
    public class Background : BaseEntity, IDrawableEntity, IEquatable<Background>
    {
        [BsonElement("localId")]
        public string LocalId { get; set; }

        [Required]
        [BsonElement("name")]
        public string Name { get; set; }

        [Required, DefaultValue(EntityType.Background)]
        [JsonConverter(typeof(StringEnumConverter))]
        [BsonElement("type"), BsonSerializer(typeof(EntityTypeBsonSerializer))]
        public EntityType Type { get; set; }
        [BsonElement("description")]
        public string Description { get; set; }

        [Required, Range(50, 4096)]
        [BsonElement("width")]
        public int? Width { get; set; }
        [Required, Range(50, 4096)]
        [BsonElement("height")]
        public int? Height { get; set; }

        [BsonElement("category")]
        public string Category { get; set; }

        [BsonElement("isPublic")]
        public bool? IsPublic { get; set; }
        [BsonElement("removed")]
        public bool? IsRemoved { get; set; }
        [BsonElement("author")]
        public string Author { get; set; }
        [Required]
        [BsonElement("userId")]
        public string UserId { get; set; }

        [BsonElement("client")]
        public Client Client { get; set; }

        public bool Equals(Background other)
        {
            if (other == null)
                return false;
            return Id == other.Id || LocalId == other.LocalId;
        }
    }
}
