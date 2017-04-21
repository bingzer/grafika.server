using System.Collections.Generic;

namespace Grafika.Connections
{
    public interface IConnectionManager
    {
        IEnumerable<IConnectionHub> Connections { get; }

        void Register<TConnection>() where TConnection : IConnectionHub;
    }
}
