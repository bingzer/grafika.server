using Grafika.Services.Aws;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Aws
{
    public class FrameDataProcessingFactoryTest
    {
        [Fact]
        public void TestGetProcessor()
        {
            var mockServiceProvider = MockHelpers.ServiceProvider;
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(FrameDataDeflatedProcessingStrategy))))
                .Returns(new FrameDataDeflatedProcessingStrategy(null))
                .Verifiable();
            mockServiceProvider.Setup(c => c.GetService(It.Is<Type>(t => t == typeof(FrameDataRawProcessingStrategy))))
                .Returns(new FrameDataRawProcessingStrategy(null))
                .Verifiable();

            var factory = new FrameDataProcesingFactory(mockServiceProvider.Object);

            Assert.IsType<FrameDataRawProcessingStrategy>(factory.GetProcessor("deflate"));
            Assert.IsType<FrameDataRawProcessingStrategy>(factory.GetProcessor("dEFlatE"));

            Assert.IsType<FrameDataDeflatedProcessingStrategy>(factory.GetProcessor(""));
            Assert.IsType<FrameDataDeflatedProcessingStrategy>(factory.GetProcessor(null));

            Assert.IsType<FrameDataDeflatedProcessingStrategy>(factory.GetProcessor("some random string"));
        }
    }
}
