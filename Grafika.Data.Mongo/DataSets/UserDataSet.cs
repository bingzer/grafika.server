using System;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace Grafika.Data.Mongo.DataSets
{
    class UserDataSet : MongoDataSet<User>
    {
        public UserDataSet(IMongoDatabase db)
            : base(db.GetCollection<User>("users"))
        {
        }

        public override Task EnsureIndex()
        {
            var indexKeyDefinition = new JsonIndexKeysDefinition<User>("{ name: \"text\", firstName: \"text\", lastName: \"text\", username: \"text\" }, { name: \"UserTextIndex\", weights: { email: 10, lastName: 6, firstName: 4, username: 2 } }");
            return Collection.Indexes.CreateOneAsync(indexKeyDefinition);
        }
    }
}
