using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Grafika.Animations
{
    [BsonIgnoreExtraElements]
    public class Series : BaseEntity, IEquatable<Series>
    {
        /// <summary>
        /// The name of this series
        /// </summary>
        [Required]
        [BsonElement("name")]
        public string Name { get; set; }

        /// <summary>
        /// The description
        /// </summary>
        [BsonElement("description")]
        public string Description { get; set; }

        /// <summary>
        /// User Id who owns this series
        /// </summary>
        [Required]
        [BsonElement("userId")]
        public string UserId { get; set; }

        /// <summary>
        /// Animation ids belongs to this series
        /// </summary>
        [Required]
        [BsonElement("animationIds")]
        public IEnumerable<string> AnimationIds { get; set; }

        [BsonIgnore]
        public IEnumerable<Animation> Animations { get; set; }

        #region IEquatable
        public bool Equals(Series other)
        {
            if (other == null)
                return false;
            return Id == other.Id;
        }
        #endregion
    }
}
