using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Grafika.Animations
{
    [BsonIgnoreExtraElements]
    public class Animation : BaseEntity, IDrawable, IEntity, IEquatable<Animation>
    {
        public const string DefaultType = "Animation";
        public const int DefaultTimer = 500;
        
        [BsonElement("localId")]
        public string LocalId { get; set; }

        [Required]
        [BsonElement("name")]
        public string Name { get; set; }

        [Required, DefaultValue(DefaultType)]
        [BsonElement("type")]
        public string Type { get; set; }
        [BsonElement("description")]
        public string Description { get; set; }

        [Required, Range(10, 600000), DefaultValue(DefaultTimer)]  // 10 ms -> 10 minues
        [BsonElement("timer")]
        public int? Timer { get; set; }
        [Required, Range(50, 4096)]
        [BsonElement("width")]
        public int? Width { get; set; }
        [Required, Range(50, 4096)]
        [BsonElement("height")]
        public int? Height { get; set; }

        [BsonElement("views")]
        public int? Views { get; set; }
        [BsonElement("rating")]
        public double? Rating { get; set; }
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
        [Required, Range(0, 10000)]  // 10000 frames
        [BsonElement("totalFrame")]
        public int? TotalFrame { get; set; }

        [BsonElement("resources")]
        public IEnumerable<IResource> Resources { get; set; }
        [BsonElement("client")]
        public Client Client { get; set; }

        //public string ThumbnailUrl { get; set; }
        //public bool IsModified { get; set; }
        //public int CurrentFrame { get; set; }

        public bool Equals(Animation other)
        {
            if (other == null)
                return false;
            return Id == other.Id || LocalId == other.LocalId;
        }
    }
}
