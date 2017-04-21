using System;
using System.Threading.Tasks;
using Grafika.Connections;
using Grafika.Data.Mongo.Supports;

namespace Grafika.Data.Mongo
{
    public class MongoConnectionHub : ConnectionHub, IMongoConnectionHub
    {
        private readonly IMongoDataContext _context;
        private readonly IMongoConnector _dbConnector;

        public MongoConnectionHub(IMongoConnector dbConnector, IMongoDataContext context):
            base ("MongoDb")
        {
            _context = context;
            _dbConnector = dbConnector;
        }

        public override Task EnsureReady()
        {
            return Task.WhenAll(
                _context.Animations.ToMongoDataSet().EnsureIndex(),
                _context.Users.ToMongoDataSet().EnsureIndex(),
                _context.Backgrounds.ToMongoDataSet().EnsureIndex()
            );
        }

        public override Task CheckStatus()
        {
            if (_dbConnector.Client.Cluster.Description.State != MongoDB.Driver.Core.Clusters.ClusterState.Connected)
                throw new Exception();

            return Task.FromResult(0);
        }
    }
}
