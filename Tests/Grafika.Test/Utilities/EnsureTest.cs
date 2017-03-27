using Grafika.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Utilities
{
    public class EnsureTest
    {
        [Fact]
        public void TestNotNull()
        {
            Assert.Throws<NullReferenceException>(() => Ensure.NotNull(null));
            Ensure.NotNull("");
        }

        [Fact]
        public void TestNotNullOrEmpty()
        {
            IList<string> list = null;
            Assert.Throws<NullReferenceException>(() => Ensure.NotNullOrEmpty(list));
            list = new List<string>();
            Assert.Throws<ArgumentException>(() => Ensure.NotNullOrEmpty(list));

            list.Add("test");
            Ensure.NotNullOrEmpty(list);
        }

        [Fact]
        public void TestArgumentNotNull()
        {
            Assert.Throws<ArgumentNullException>(() => Ensure.ArgumentNotNull(null, "test"));
            Ensure.ArgumentNotNull("some content", "test");
        }
        
        [Fact]
        public void TestArgumentNotNullOrEmptyString()
        {
            Assert.Throws<ArgumentNullException>(() => Ensure.ArgumentNotNullOrEmptyString(null, "test"));
            Assert.Throws<ArgumentException>(() => Ensure.ArgumentNotNullOrEmptyString("", "test"));
            Ensure.ArgumentNotNullOrEmptyString("some content", "test");
        }

        [Fact]
        public void TestGreaterThanZero()
        {
            Assert.Throws<ArgumentException>(() => Ensure.GreaterThanZero(TimeSpan.FromMinutes(-1), ""));
            Ensure.GreaterThanZero(TimeSpan.FromMinutes(10), "");
        }
    }
}
