using Grafika.Animations;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace Grafika.Data.Mongo.DataSets
{
    class BackgroundDataSet : MongoDataSet<Background>
    {
        public BackgroundDataSet(IMongoDatabase db) 
            : base(db.GetCollection<Background>("backgrounds"))
        {
        }

        public override Task EnsureIndex()
        {
            var indexDefinition = new IndexKeysDefinitionBuilder<Background>()
                                            .Text(background => background.Name)
                                            .Text(background => background.Description)
                                            .Text(background => background.Author);
            var createIndexOptions = new CreateIndexOptions<Background>
            {
                Name = "BackgroundTextIndex",
                Weights = new { name = 10, description = 4, author = 2 }.ToBsonDocument()
            };

            return Collection.Indexes.CreateOneAsync(indexDefinition, createIndexOptions);
        }
    }
}
