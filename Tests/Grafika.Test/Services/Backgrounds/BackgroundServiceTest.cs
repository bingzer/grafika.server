using Grafika.Services;
using Grafika.Services.Backgrounds;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services.Backgrounds
{
    public class BackgroundServiceTest
    {
        [Fact]
        public async void TestBulkDelete()
        {
            var mockRepo = new Mock<IBackgroundRepository>();
            mockRepo.Setup(c => c.RemoveByIds(It.IsAny<IEnumerable<string>>()))
                .Returns(Task.FromResult(0))
                .Verifiable();

            var service = new BackgroundService(MockHelpers.ServiceContext.Object, mockRepo.Object, null, null, null);
            await service.Delete(new string[] { "1", "2" });

            mockRepo.VerifyAll();
        }
    }
}
