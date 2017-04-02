using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test
{
    public class SortOptionsTest
    {
        [Fact]
        public void TestTryParse()
        {
            var result = SortOptions.TryParse("-lastModified", out var options);
            Assert.True(result);
            Assert.Equal("lastModified", options.Name);
            Assert.Equal(SortDirection.Descending, options.Direction);

            SortOptions.TryParse("lastModified", out options);
            Assert.True(result);
            Assert.Equal("lastModified", options.Name);
            Assert.Equal(SortDirection.Ascending, options.Direction);

            SortOptions.TryParse("+lastModified", out options);
            Assert.True(result);
            Assert.Equal("lastModified", options.Name);
            Assert.Equal(SortDirection.Ascending, options.Direction);
        }

        [Fact]
        public void TestTryParse_BadString()
        {
            var result = SortOptions.TryParse("sort=-lastModified", out var options);
            Assert.False(result);
        }
    }
}
