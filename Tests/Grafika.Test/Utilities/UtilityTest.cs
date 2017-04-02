using Grafika.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Utilities
{
    public class UtilityTest
    {
        [Fact]
        public void TestCombineUrl()
        {
            var actual = Utility.CombineUrl("https://github.com", "bingzer", "/grafika/", "server//", "//netcore");
            Assert.Equal("https://github.com/bingzer/grafika/server/netcore", actual);

            actual = Utility.CombineUrl("https://github.com", "bingzer", null, "/grafika/", "server//", "//netcore", null);
            Assert.Equal("https://github.com/bingzer/grafika/server/netcore", actual);

            actual = Utility.CombineUrl("https://github.com", "bingzer", null, "/grafika/", "server//", "//netcore", null, "index.html");
            Assert.Equal("https://github.com/bingzer/grafika/server/netcore/index.html", actual);
        }

        [Fact]
        public void TestCombineUrl_Uri()
        {
            var uri = new Uri("https://github.com/bingzer/grafika/server/");

            var actual = Utility.CombineUrl(uri, "netcore");
            Assert.Equal("https://github.com/bingzer/grafika/server/netcore", actual);
        }

        [Fact]
        public void TestUrlEncode()
        {
            var str = "Hello World";
            Assert.Equal("Hello%20World", Utility.UrlEncode(str));
        }

        [Fact]
        public void TestRandomblyPickOne()
        {
            for (int i = 0; i < 100; i++)
            {
                Assert.InRange(Utility.RandomlyPickOne(1, 2, 3, 4, 5), 1, 5);
            }
        }

        [Fact]
        public void TestRandomlyPickFrom()
        {
            for (int i = 0; i < 100; i++)
            {
                Assert.InRange(Utility.RandomlyPickFrom(1, 5), 1, 5);
            }
        }
    }
}
