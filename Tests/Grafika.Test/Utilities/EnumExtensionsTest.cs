using Grafika.Utilities;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Utilities
{
    public class EnumExtensionsTest
    {
        [Fact]
        public void TestGetName()
        {
            Assert.Equal("Yes", SimpleEnum.Yes.GetName());
            Assert.Equal("No", SimpleEnum.No.GetName());
        }
    }

    internal enum SimpleEnum
    {
        Yes,
        No
    };
}
