using Grafika.Configurations;
using Grafika.Data.Mongo;
using MongoDB.Driver;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Data.Mongo
{
    public class MongoConnectorTest
    {
        [Fact]
        public void TestCotr()
        {
            var mockClient = new Mock<IMongoClient>();
            var client = mockClient.Object;

            var connector = new MongoConnector(client, "DatabaseName");
            Assert.Same(client, connector.Client);
            Assert.Equal("DatabaseName", connector.DatabaseName);
        }

        [Fact]
        public void TestGetDatabase()
        {
            var mockClient = new Mock<IMongoClient>();
            var client = mockClient.Object;

            var connector = new MongoConnector(client, "DatabaseName");
            connector.GetDatabase();

            mockClient.Verify(c => c.GetDatabase(It.Is<string>(str => str == "DatabaseName"), It.IsAny<MongoDatabaseSettings>()));
        }
    }
}
