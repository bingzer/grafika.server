using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Grafika.Connections
{
    public interface IConnectionHub
    {
        Task EnsureReady();
        Task<ConnectionStatus> GetStatus();
    }
}
