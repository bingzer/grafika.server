using Grafika.Animations;
using MongoDB.Driver;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace Grafika.Data.Mongo.DataSets
{
    class AnimationDataSet : MongoDataSet<Animation>
    {
        public AnimationDataSet(IMongoDatabase db) 
            : base(db.GetCollection<Animation>("animations"))
        {
        }

        public override Task EnsureIndex()
        {
            var indexDefinition = new IndexKeysDefinitionBuilder<Animation>()
                                            .Text(anim => anim.Name)
                                            .Text(anim => anim.Description)
                                            .Text(anim => anim.Author);
            var createIndexOptions = new CreateIndexOptions<Animation>
            {
                Name = "AnimationTextIndex",
                Weights = new { name = 10, description = 4, author = 2 }.ToBsonDocument()
            };

            return Collection.Indexes.CreateOneAsync(indexDefinition, createIndexOptions);
        }
    }
}
