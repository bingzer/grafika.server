using Grafika.Utilities;
using System;

namespace Grafika.Syncs
{
    public class SyncEvent : IEquatable<SyncEvent>
    {
        public string AnimationId { get; set; }
        public string LocalId { get; set; }
        public SyncAction Action { get; set; }

        public override string ToString()
        {
            return $"SyncEvent {{Action={Action.GetName()}, LocalId={LocalId ?? "Undefined"}, AnimationId={AnimationId}}}";
        }

        public bool Equals(SyncEvent other)
        {
            if (other == null)
                return false;

            return AnimationId == other.AnimationId && LocalId == other.LocalId;
        }
    }
}
