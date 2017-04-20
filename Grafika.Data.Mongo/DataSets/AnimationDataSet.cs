using Grafika.Animations;
using System;
using MongoDB.Driver;
using System.Threading.Tasks;

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
            var indexKeyDefinition = new JsonIndexKeysDefinition<Animation>("{ name: \"text\", description: \"text\", author: \"text\" }, { name: \"AnimationTextIndex\", weights: { name: 10, description: 4, author: 2 } }");
            return Collection.Indexes.CreateOneAsync(indexKeyDefinition);
        }
    }
}
