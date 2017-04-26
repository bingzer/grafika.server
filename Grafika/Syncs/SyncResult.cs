using Grafika.Animations;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Grafika.Syncs
{
    public class SyncResult
    {
        private readonly ISet<SyncEvent> _events;

        public string ClientId { get; private set; }
        public long SyncDate { get; private set; }
        public IEnumerable<SyncEvent> Events => _events;

        public SyncResult(string clientId)
        {
            _events = new HashSet<SyncEvent>();
            ClientId = clientId;
            SyncDate = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        }

        public void AddAction(SyncAction action, Background background)
        {
            _events.Add(new SyncEvent { Action = action, EntityId = background.Id, EntityType = Background.DefaultType, LocalId = background.LocalId });
        }

        public void AddAction(SyncAction action, Animation animation)
        {
            _events.Add(new SyncEvent { Action = action, EntityId = animation.Id, EntityType = Animation.DefaultType, LocalId = animation.LocalId });
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
