using Grafika.Data.Mongo;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Data.Mongo
{
    public class ObjectPartialUpdateDefinitionBuilderTest
    {
        [Fact]
        public void TestCotr()
        {
            var simpleEntity = new SimpleEntity { Id = "Id", FirstName = "FirstName", LastName = "LastName" };

            var builder = new ObjectPartialUpdateDefinitionBuilder<SimpleEntity>(simpleEntity);
            var update = builder.Build();
        }



    }

    class SimpleEntity : BaseEntity
    {
        [BsonElement("firstName")]
        public string FirstName { get; set; }
        [BsonElement("lastName")]
        public string LastName { get; set; }
    }
}
