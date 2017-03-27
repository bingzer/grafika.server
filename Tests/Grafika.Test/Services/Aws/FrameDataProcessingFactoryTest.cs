using Grafika.Services.Aws;
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
            var factory = new FrameDataProcesingFactory();
            Assert.IsType<FrameDataRawProcessingStrategy>(factory.GetProcessor("deflate"));
            Assert.IsType<FrameDataRawProcessingStrategy>(factory.GetProcessor("dEFlatE"));

            Assert.IsType<FrameDataDeflatedProcessingStrategy>(factory.GetProcessor(""));
            Assert.IsType<FrameDataDeflatedProcessingStrategy>(factory.GetProcessor(null));

            Assert.IsType<FrameDataDeflatedProcessingStrategy>(factory.GetProcessor("some random string"));
        }
    }
}
