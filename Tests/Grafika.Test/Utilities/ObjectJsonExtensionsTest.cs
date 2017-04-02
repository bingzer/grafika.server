using Grafika.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Utilities
{
    public class ObjectJsonExtensionsTest
    {
        [Fact]
        public void TestToJson()
        {
            var obj = new { FirstName = "FirstName", LastName = "LastName", Age = 3 };
            var json = obj.ToJson();
            // lower case
            Assert.Equal("{\"firstName\":\"FirstName\",\"lastName\":\"LastName\",\"age\":3}", json);
        }

        [Fact]
        public void TestJObject()
        {
            var obj = new { FirstName = "FirstName", LastName = "LastName", Age = 3 };
            var jobj = obj.ToJObject();
            // no need to test this
        }
    }
}
