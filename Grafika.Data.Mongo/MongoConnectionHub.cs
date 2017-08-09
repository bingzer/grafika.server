using System;
using System.Threading.Tasks;
using Grafika.Connections;
using Grafika.Data.Mongo.Supports;
using Grafika.Configurations;
using MongoDB.Bson;

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
                _context.Series.ToMongoDataSet().EnsureIndex(),
                _context.Backgrounds.ToMongoDataSet().EnsureIndex()
            ).ContinueWith((task) => CheckStatus());
        }

        public override async Task CheckStatus()
        {
            if (_dbConnector.Client.Cluster.Description.State != MongoDB.Driver.Core.Clusters.ClusterState.Connected)
                throw new Exception();

            AppEnvironment.Default.Content.AnimationsCount = (int)await _context.Animations.ToMongoDataSet().Collection.CountAsync(new BsonDocument());
            AppEnvironment.Default.Content.UsersCount = (int)await _context.Users.ToMongoDataSet().Collection.CountAsync(new BsonDocument());
        }
    }
}
