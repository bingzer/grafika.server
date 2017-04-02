using Grafika.Animations;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Animations
{
    class FrameDataTest
    {
        [Fact]
        public void TestSetContentType()
        {
            // should remove charset
            var frameData = new FrameData();
            frameData.ContentType = "application/json; charset=UTF-8";

            Assert.Equal("application/json", frameData.ContentType);
        }
    }
}
