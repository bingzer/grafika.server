using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test
{
    public class BaseEntityTest
    {
        [Fact]
        public void TestDateTimeCreated()
        {
            var entity = new BaseEntity();
            entity.DateCreated = 1430817011000;

            var expected = new DateTimeOffset(2015, 5, 5, 9, 10, 11, TimeSpan.Zero);
            Assert.Equal(expected, entity.DateTimeCreated);

            entity.DateCreated = null;
            Assert.Equal(null, entity.DateTimeCreated);
        }

        [Fact]
        public void TestDateTimeModified()
        {
            var entity = new BaseEntity();
            entity.DateModified = 1435817055000;

            var expected = new DateTimeOffset(2015, 7, 2, 6, 4, 15, TimeSpan.Zero);
            Assert.Equal(expected, entity.DateTimeModified);

            entity.DateModified = null;
            Assert.Equal(null, entity.DateTimeModified);
        }
    }
}
