using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test
{
    public class QueryOptionsTest
    {
        [Fact]
        public void TestDefaults()
        {
            var queryOptions = new QueryOptions();
            Assert.Equal(1, queryOptions.PageNumber);
            Assert.Equal(25, queryOptions.PageSize);
        }

        [Fact]
        public void TestSkip()
        {
            var queryOptions = new QueryOptions();
            queryOptions.SetPaging(0, 10);
            Assert.Equal(1, queryOptions.PageNumber);
            Assert.Equal(10, queryOptions.PageSize);

            queryOptions.SetPaging(10, 10);
            Assert.Equal(2, queryOptions.PageNumber);
            Assert.Equal(10, queryOptions.PageSize);

            queryOptions.SetPaging(30, 10);
            Assert.Equal(4, queryOptions.PageNumber);
            Assert.Equal(10, queryOptions.PageSize);
        }
    }
}
