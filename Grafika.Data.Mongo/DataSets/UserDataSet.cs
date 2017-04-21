using System;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;

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
            var indexDefinition = new IndexKeysDefinitionBuilder<User>()
                                            .Text(user => user.Email)
                                            .Text(user => user.LastName)
                                            .Text(user => user.FirstName)
                                            .Text(user => user.Username);
            var createIndexOptions = new CreateIndexOptions<User>
            {
                Name = "UserTextIndex",
                Weights = new { email = 10, lastName = 6, firstName = 4, username = 2 }.ToBsonDocument()
            };

            return Collection.Indexes.CreateOneAsync(indexDefinition, createIndexOptions);

        }
    }
}
