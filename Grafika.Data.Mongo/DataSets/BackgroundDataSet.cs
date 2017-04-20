using Grafika.Animations;
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
            var indexKeyDefinition = new JsonIndexKeysDefinition<Background>("{ name: \"text\", description: \"text\", author: \"text\" }, { name: \"BackgroundTextIndex\", weights: { name: 10, description: 4, author: 2 } }");
            return Collection.Indexes.CreateOneAsync(indexKeyDefinition);
        }
    }
}
