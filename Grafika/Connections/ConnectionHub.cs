using System.Threading.Tasks;

namespace Grafika.Connections
{
    public abstract class ConnectionHub : IConnectionHub
    {
        public string Name { get; private set; }

        public ConnectionHub(string name)
        {
            Name = name;
        }

        public virtual Task EnsureReady()
        {
            return Task.FromResult(0);
        }

        public abstract Task CheckStatus();

        public virtual void Dispose()
        {
            // do nothing
        }
    }
}
