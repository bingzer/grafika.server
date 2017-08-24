using Grafika.Syncs;
using System;
using System.Collections.Generic;
using System.Text;
using Grafika.Animations;

namespace Grafika.Test.Services.Syncs
{
    class LocalChanges : ILocalChanges
    {
        public string ClientId { get; set; }
        public string UserId { get; set; }
        public IEnumerable<Animation> Animations { get; set; }
        public IEnumerable<Animation> Tombstones { get; set; }
        public IEnumerable<Background> Backgrounds { get; set; }
        public IEnumerable<Background> BackgroundTombstones { get; set; }
    }

    class ServerChanges : IServerChanges
    {
        public string UserId { get; set; }
        public IEnumerable<Animation> Animations { get; set; }
        public IEnumerable<Animation> Tombstones { get; set; }
        public IEnumerable<Background> Backgrounds { get; set; }
        public IEnumerable<Background> BackgroundTombstones { get; set; }
    }
}
