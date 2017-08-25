using Grafika.Syncs;
using System.Collections.Generic;
using Grafika.Animations;
using System;

namespace Grafika.Web.Models
{
    public class LocalChangesModel : ILocalChanges
    {
        public string ClientId { get; set; }
        public string UserId { get; set; }

        public IEnumerable<Animation> Animations { get; set; }
        public IEnumerable<Animation> Tombstones { get; set; }

        public IEnumerable<Background> Backgrounds { get; set; }
        public IEnumerable<Background> BackgroundTombstones { get; set; }
    }

    public class LocalChangesResultModel
    {
        public LocalChangesModel Sync { get; set; }
        public SyncResult Result { get; set; }
    }
}
