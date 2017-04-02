using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace Grafika
{
    [BsonIgnoreExtraElements]
    public class BaseEntity : IEntity
    {
        [BsonId]
        [BsonElement("_id"), JsonProperty("_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public virtual string Id { get; set; }

        [Required]
        [BsonElement("dateCreated")]
        public virtual long? DateCreated { get; set; }

        [Required]
        [BsonElement("dateModified")]
        public virtual long? DateModified { get; set; }

        [BsonIgnore, JsonIgnore]
        public virtual DateTimeOffset? DateTimeCreated
        {
            get
            {
                if (!DateCreated.HasValue) return null;
                return DateTimeOffset.FromUnixTimeMilliseconds(DateCreated.Value);
            }
        }
        [BsonIgnore, JsonIgnore]
        public virtual DateTimeOffset? DateTimeModified
        {
            get
            {
                if (!DateModified.HasValue) return null;
                return DateTimeOffset.FromUnixTimeMilliseconds(DateModified.Value);
            }
        }
    }
}
