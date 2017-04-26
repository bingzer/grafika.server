using Grafika.Animations;
using Grafika.Data.Mongo;
using MongoDB.Driver;
using MongoDB.Driver.Core.Clusters;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Data.Mongo
{
    public class MongoConnectionHubTest
    {
        [Fact]
        public async void TestEnsureReady()
        {
            var mockAnimations = new Mock<IMongoDataSet<Animation>>();
            mockAnimations.Setup(c => c.EnsureIndex()).Returns(Task.FromResult(0)).Verifiable();
            var mockBackgrounds = new Mock<IMongoDataSet<Background>>();
            mockBackgrounds.Setup(c => c.EnsureIndex()).Returns(Task.FromResult(0)).Verifiable();
            var mockUsers = new Mock<IMongoDataSet<User>>();
            mockUsers.Setup(c => c.EnsureIndex()).Returns(Task.FromResult(0)).Verifiable();

            var mockMongoConnector = new Mock<IMongoConnector>();
            var mockMongoContext = new Mock<IMongoDataContext>();
            mockMongoContext.Setup(c => c.Animations).Returns(mockAnimations.Object).Verifiable();
            mockMongoContext.Setup(c => c.Backgrounds).Returns(mockBackgrounds.Object).Verifiable();
            mockMongoContext.Setup(c => c.Users).Returns(mockUsers.Object).Verifiable();

            var hub = new MongoConnectionHub(mockMongoConnector.Object, mockMongoContext.Object);
            
            await hub.EnsureReady();

            mockMongoConnector.VerifyAll();
            mockMongoContext.VerifyAll();
            mockAnimations.VerifyAll();
            mockBackgrounds.VerifyAll();
            mockUsers.VerifyAll();
        }
    }
}
