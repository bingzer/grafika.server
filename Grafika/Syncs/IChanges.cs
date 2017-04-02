using Grafika.Animations;
using System.Collections.Generic;

namespace Grafika.Syncs
{
    public interface IChanges
    {
        string UserId { get; }
        IEnumerable<Animation> Animations { get; }
        IEnumerable<Animation> Tombstones { get; }
    }

    public interface ILocalChanges : IChanges
    {
        string ClientId { get; }
    }

    public interface IServerChanges : IChanges
    {

    }
}
