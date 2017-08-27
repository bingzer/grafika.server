using Grafika.Connections;
using Grafika.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Grafika.Services.Connections
{
    class ConnectionManager : IConnectionManager
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ICollection<Type> _connectionTypes;

        public IEnumerable<IConnectionHub> Connections => _connectionTypes.Select(conn => _serviceProvider.GetService(conn)).Cast<IConnectionHub>();

        public ConnectionManager(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            _connectionTypes = new HashSet<Type>();
        }

        public void Register<TConnection>() where TConnection : IConnectionHub
        {
            _connectionTypes.Add(typeof(TConnection));
        }
    }
}
