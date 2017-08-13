using Grafika.Animations;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace Grafika.Data.Mongo.DataSets
{
    class SeriesDataSet : MongoDataSet<Series>
    {
        public SeriesDataSet(IMongoDatabase db) 
            : base(db.GetCollection<Series>("series"))
        {
        }

        public override Task EnsureIndex()
        {
            var indexDefinition = new IndexKeysDefinitionBuilder<Series>()
                                            .Text(anim => anim.Name)
                                            .Text(anim => anim.Description);
            var createIndexOptions = new CreateIndexOptions<Series>
            {
                Name = "SeriesTextIndex",
                Weights = new { name = 10, description = 4 }.ToBsonDocument()
            };

            return Collection.Indexes.CreateOneAsync(indexDefinition, createIndexOptions);
        }
    }
}
