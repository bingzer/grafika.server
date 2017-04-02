using Grafika.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Utilities
{
    public class StringExtensionsTest
    {
        [Fact]
        public void TestEqualsIgnoreCase()
        {
            Assert.True("ABCD".EqualsIgnoreCase("abCd"));
        }
    }
}
