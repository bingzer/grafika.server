using Grafika.Animations;
using Grafika.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace Grafika.Syncs
{
    public class SyncEvent : IEquatable<SyncEvent>
    {
        public string EntityId { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public EntityType EntityType { get; set; }

        public string LocalId { get; set; }
        public SyncAction Action { get; set; }

        public string AnimationId
        {
            get
            {
                if (EntityType == EntityType.Animation)
                    return EntityId;
                return null;
            }
            set
            {
                EntityType = EntityType.Animation;
                EntityId = value;
            }
        }

        public override string ToString()
        {
            return $"SyncEvent {{Action={Action.GetName()}, LocalId={LocalId ?? "Undefined"}, EntityId={EntityId}, EntityType={EntityType}}}";
        }

        public bool Equals(SyncEvent other)
        {
            if (other == null)
                return false;

            return EntityId == other.EntityId && LocalId == other.LocalId;
        }
    }
}
