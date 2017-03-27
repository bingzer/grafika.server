using Grafika.Animations;
using Grafika.Data.Mongo;
using MongoDB.Driver;
using Moq;
using Xunit;

namespace Grafika.Test.Data.Mongo
{
    public class MongoDbContextTest
    {
        [Fact]
        public void TestCotr()
        {
            var mockAnimationsCollection = new Mock<IMongoCollection<Animation>>();
            var mockUsersCollection = new Mock<IMongoCollection<User>>();

            var mockDb = new Mock<IMongoDatabase>();
            mockDb.Setup(c => c.GetCollection<Animation>(It.Is<string>(v => v == "animations"), It.IsAny<MongoCollectionSettings>())).Returns(mockAnimationsCollection.Object);
            mockDb.Setup(c => c.GetCollection<User>(It.Is<string>(v => v == "users"), It.IsAny<MongoCollectionSettings>())).Returns(mockUsersCollection.Object);
            var mockConnector = new Mock<IMongoDbConnector>();
            mockConnector.Setup(c => c.GetDatabase()).Returns(mockDb.Object);

            var context = new MongoDbContext(mockConnector.Object);

            mockConnector.Verify(c => c.GetDatabase());
            mockDb.Verify(c => c.GetCollection<Animation>(It.Is<string>(value => value == "animations"), It.IsAny<MongoCollectionSettings>()));
            mockDb.Verify(c => c.GetCollection<User>(It.Is<string>(value => value == "users"), It.IsAny<MongoCollectionSettings>()));
        }

        [Fact]
        public void TestSet()
        {
            var mockAnimationsCollection = new Mock<IMongoCollection<Animation>>();
            var mockUsersCollection = new Mock<IMongoCollection<User>>();

            var mockDb = new Mock<IMongoDatabase>();
            mockDb.Setup(c => c.GetCollection<Animation>(It.Is<string>(v => v == "animations"), It.IsAny<MongoCollectionSettings>())).Returns(mockAnimationsCollection.Object);
            mockDb.Setup(c => c.GetCollection<User>(It.Is<string>(v => v == "users"), It.IsAny<MongoCollectionSettings>())).Returns(mockUsersCollection.Object);
            var mockConnector = new Mock<IMongoDbConnector>();
            mockConnector.Setup(c => c.GetDatabase()).Returns(mockDb.Object);

            var context = new MongoDbContext(mockConnector.Object);

            Assert.IsType<MongoDataSet<Animation>>(context.Set<Animation>());
            Assert.IsType<MongoDataSet<User>>(context.Set<User>());
        }

        [Theory]
        [InlineData("58d5b799963ca021041cb6a2", true)]
        [InlineData("58d5b799963ca021041cb6b3", true)]
        [InlineData("58d5b799963ca021041", false)]
        [InlineData("", false)]
        [InlineData(null, false)]
        public void TestValidateId(string id, bool expected)
        {
            var mockAnimationsCollection = new Mock<IMongoCollection<Animation>>();
            var mockUsersCollection = new Mock<IMongoCollection<User>>();

            var mockDb = new Mock<IMongoDatabase>();
            mockDb.Setup(c => c.GetCollection<Animation>(It.Is<string>(v => v == "animations"), It.IsAny<MongoCollectionSettings>())).Returns(mockAnimationsCollection.Object);
            mockDb.Setup(c => c.GetCollection<User>(It.Is<string>(v => v == "users"), It.IsAny<MongoCollectionSettings>())).Returns(mockUsersCollection.Object);
            var mockConnector = new Mock<IMongoDbConnector>();
            mockConnector.Setup(c => c.GetDatabase()).Returns(mockDb.Object);

            var context = new MongoDbContext(mockConnector.Object);

            Assert.Equal(expected, context.ValidateId(id));

        }
    }
}
