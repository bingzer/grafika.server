using MongoDB.Bson;

namespace Grafika.Data.Mongo
{
    class MongoEntityIdValidator : IEntityIdValidator
    {
        public bool ValidateId(string id)
        {
            return ObjectId.TryParse(id, out var oid);
        }
    }
}
