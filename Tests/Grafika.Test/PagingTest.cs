using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test
{
    public class PagingTest
    {
        [Fact]
        public void TestPaging()
        {
            var list = new List<string>();
            for (var i = 1; i <= 100; i++)
                list.Add("list#" + i);

            var paging = new Paging<string>(list, 1, 25);
            Assert.Equal("list#15", paging[14]);
            Assert.Equal(25, paging.PageSize);
            Assert.Equal(1, paging.PageNumber);


            paging = new Paging<string>(list, 2, 25);
            Assert.Equal("list#40", paging[14]);
            Assert.Equal(25, paging.PageSize);
            Assert.Equal(2, paging.PageNumber);

            paging = new Paging<string>(list, 3, 25);
            Assert.Equal("list#65", paging[14]);
            Assert.Equal(25, paging.PageSize);
            Assert.Equal(3, paging.PageNumber);

            paging = new Paging<string>(list, 4, 25);
            Assert.Equal("list#90", paging[14]);
            Assert.Equal(25, paging.PageSize);
            Assert.Equal(4, paging.PageNumber);

            paging = new Paging<string>(list, 5, 25);
            Assert.Equal(0, paging.Count);
            Assert.Equal(25, paging.PageSize);
            Assert.Equal(5, paging.PageNumber);
        }

        [Fact]
        public void TestPaging2()
        {
            var list = new List<string>();
            for (var i = 1; i <= 103; i++)
                list.Add("list#" + i);

            var paging = new Paging<string>(list, 5, 25);
            Assert.Equal("list#101", paging[0]);
            Assert.Equal("list#102", paging[1]);
            Assert.Equal("list#103", paging[2]);
            Assert.Equal(3, paging.Count);
            Assert.Equal(25, paging.PageSize);
            Assert.Equal(5, paging.PageNumber);
        }

        [Fact]
        public void TestPaging_NoPaging()
        {
            var list = new List<string>();
            for (var i = 1; i <= 100; i++)
                list.Add("list#" + i);

            var expectedCount = list.Count;
            var queryOptions = new QueryOptions();

            var paging = new Paging<string>(list, queryOptions);
            Assert.Equal(queryOptions.PageSize, paging.Count);

            // no paging
            paging = new Paging<string>(list, -1, -1);
            Assert.Equal(expectedCount, paging.Count);
        }
    }
}
