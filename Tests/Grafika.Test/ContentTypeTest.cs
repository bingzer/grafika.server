using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test
{
    public class ContentTypeTest
    {
        [Fact]
        public void TestNoCharset()
        {
            var type = "application/json; charset=UTF-8";
            var actual = ContentTypes.NoCharset(type);

            Assert.Equal("application/json", actual);
        }

        [Fact]
        public void TestNoCharset_Null()
        {
            var actual = ContentTypes.NoCharset(null);

            Assert.Null(actual);
        }
    }
}
