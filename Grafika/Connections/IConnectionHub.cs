using System;
using System.Threading.Tasks;

namespace Grafika.Connections
{
    public interface IConnectionHub : IDisposable
    {
        string Name { get; }

        Task EnsureReady();
        Task CheckStatus();
    }
}
