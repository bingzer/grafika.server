using MongoDB.Bson.Serialization.Serializers;
using System;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;

namespace Grafika
{
    class EntityTypeBsonSerializer : EnumSerializer<EntityType>
    {
        public override EntityType Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
        {
            var bsonReader = context.Reader;

            var bsonType = bsonReader.GetCurrentBsonType();
            switch (bsonType)
            {
                case BsonType.String: return (EntityType)Enum.Parse(typeof(EntityType), bsonReader.ReadString(), true);
                default:
                    return base.Deserialize(context, args);
            }
        }
    }
}
