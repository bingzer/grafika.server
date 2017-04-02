using Grafika.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services
{
    public class ServiceTest
    {
        [Fact]
        public void TestCotr()
        {
            var mockIdentity = new Mock<IUserIdentity>();
            var mockContext = new Mock<IServiceContext>();
            mockContext.Setup(c => c.Identity).Returns(mockIdentity.Object);

            var service = new Service(mockContext.Object);
            var user = service.User;

            mockContext.Verify(c => c.Identity);
        }
    }
}
