using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test
{
    public class AnimationQueryOptionsTest
    {
        [Fact]
        public void TestDefaults()
        {
            var options = new AnimationQueryOptions();
            Assert.Null(options.Term);
            Assert.Null(options.UserId);
            Assert.Null(options.IsRemoved);
            Assert.Null(options.IsPublic);
            Assert.Null(options.IsRandom);
            Assert.Null(options.RelatedToAnimationId);
        }
    }
}
