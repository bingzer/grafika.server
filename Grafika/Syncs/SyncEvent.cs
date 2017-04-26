using Grafika.Animations;
using Grafika.Utilities;
using System;

namespace Grafika.Syncs
{
    public class SyncEvent : IEquatable<SyncEvent>
    {
        public string EntityId { get; set; }
        public string EntityType { get; set; }

        public string LocalId { get; set; }
        public SyncAction Action { get; set; }

        public string AnimationId
        {
            get
            {
                if (EntityType == Animation.DefaultType)
                    return EntityId;
                return null;
            }
            set
            {
                EntityType = Animation.DefaultType;
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
