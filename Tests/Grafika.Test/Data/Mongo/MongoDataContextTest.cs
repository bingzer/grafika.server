using Grafika.Animations;
using Grafika.Data.Mongo;
using MongoDB.Driver;
using Moq;
using Xunit;

namespace Grafika.Test.Data.Mongo
{
    public class MongoDataContextTest
    {
        [Fact]
        public void TestCotr()
        {
            var mockAnimationsCollection = new Mock<IMongoCollection<Animation>>();
            var mockUsersCollection = new Mock<IMongoCollection<User>>();
            var mockBackgroundsCollection = new Mock<IMongoCollection<Background>>();

            var mockDb = new Mock<IMongoDatabase>();
            mockDb.Setup(c => c.GetCollection<Animation>(It.Is<string>(v => v == "animations"), It.IsAny<MongoCollectionSettings>())).Returns(mockAnimationsCollection.Object);
            mockDb.Setup(c => c.GetCollection<User>(It.Is<string>(v => v == "users"), It.IsAny<MongoCollectionSettings>())).Returns(mockUsersCollection.Object);
            mockDb.Setup(c => c.GetCollection<Background>(It.Is<string>(v => v == "backgrounds"), It.IsAny<MongoCollectionSettings>())).Returns(mockBackgroundsCollection.Object);
            var mockConnector = new Mock<IMongoConnector>();
            mockConnector.Setup(c => c.GetDatabase()).Returns(mockDb.Object);

            var context = new MongoDataContext(mockConnector.Object);

            mockConnector.Verify(c => c.GetDatabase());
            mockDb.Verify(c => c.GetCollection<Animation>(It.Is<string>(value => value == "animations"), It.IsAny<MongoCollectionSettings>()));
            mockDb.Verify(c => c.GetCollection<User>(It.Is<string>(value => value == "users"), It.IsAny<MongoCollectionSettings>()));
            mockDb.Verify(c => c.GetCollection<Background>(It.Is<string>(v => v == "backgrounds"), It.IsAny<MongoCollectionSettings>()));
        }

        [Fact]
        public void TestSet()
        {
            var mockAnimationsCollection = new Mock<IMongoCollection<Animation>>();
            var mockUsersCollection = new Mock<IMongoCollection<User>>();
            var mockBackgroundsCollection = new Mock<IMongoCollection<Background>>();

            var mockDb = new Mock<IMongoDatabase>();
            mockDb.Setup(c => c.GetCollection<Animation>(It.Is<string>(v => v == "animations"), It.IsAny<MongoCollectionSettings>())).Returns(mockAnimationsCollection.Object);
            mockDb.Setup(c => c.GetCollection<User>(It.Is<string>(v => v == "users"), It.IsAny<MongoCollectionSettings>())).Returns(mockUsersCollection.Object);
            mockDb.Setup(c => c.GetCollection<Background>(It.Is<string>(v => v == "backgrounds"), It.IsAny<MongoCollectionSettings>())).Returns(mockBackgroundsCollection.Object);
            var mockConnector = new Mock<IMongoConnector>();
            mockConnector.Setup(c => c.GetDatabase()).Returns(mockDb.Object);

            var context = new MongoDataContext(mockConnector.Object);

            Assert.IsAssignableFrom<MongoDataSet<Animation>>(context.Set<Animation>());
            Assert.IsAssignableFrom<MongoDataSet<User>>(context.Set<User>());
            Assert.IsAssignableFrom<MongoDataSet<Background>>(context.Set<Background>());
        }
    }
}
