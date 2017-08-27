using Grafika.Animations;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Grafika.Syncs
{
    public class SyncResult
    {
        public string ClientId { get; private set; }
        public long SyncDate { get; private set; }
        public ICollection<SyncEvent> Events { get; private set; }

        public SyncResult(string clientId)
        {
            Events = new HashSet<SyncEvent>();
            ClientId = clientId;
            SyncDate = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        }

        public void AddAction(SyncAction action, Background background)
        {
            Events.Add(new SyncEvent { Action = action, EntityId = background.Id, EntityType = EntityType.Background, LocalId = background.LocalId });
        }

        public void AddAction(SyncAction action, Animation animation)
        {
            Events.Add(new SyncEvent { Action = action, EntityId = animation.Id, EntityType = EntityType.Animation, LocalId = animation.LocalId });
        }

        public override string ToString()
        {
            var eventDisplay = "\n\tNo sync event";
            if (Events.Any())
                eventDisplay = string.Join("\n\t", Events.Select(e => e.ToString()));
            return $"SyncResult:{eventDisplay}";
        }
    }
}
