using System;
using System.Threading.Tasks;
using Grafika.Connections;
using Grafika.Data.Mongo.Supports;

namespace Grafika.Data.Mongo
{
    public class MongoConnectionHub : IDataConnectionHub
    {
        private readonly IMongoDataContext _context;
        private readonly IMongoConnector _dbConnector;

        public MongoConnectionHub(IMongoConnector dbConnector, IMongoDataContext context)
        {
            _context = context;
            _dbConnector = dbConnector;
        }

        public Task EnsureReady()
        {
            return Task.WhenAll(
                _context.Animations.ToMongoDataSet().EnsureIndex(),
                _context.Users.ToMongoDataSet().EnsureIndex(),
                _context.Backgrounds.ToMongoDataSet().EnsureIndex()
            );
        }

        public Task<ConnectionStatus> GetStatus()
        {
            var status = new ConnectionStatus();
            try
            {
                status.Status = _dbConnector.Client.Cluster.Description.State == MongoDB.Driver.Core.Clusters.ClusterState.Connected;
            }
            catch (Exception e)
            {
                status.Exception = e;
            }

            return Task.FromResult(status);
        }
    }
}
