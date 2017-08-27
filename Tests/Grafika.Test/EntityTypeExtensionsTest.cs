using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test
{
    public class EntityTypeExtensionsTest
    {

        [Theory]
        [InlineData(EntityType.Animation, "Animation")]
        [InlineData(EntityType.Background, "Background")]
        public void TestGetName(EntityType entityType, string expected)
        {
            Assert.Equal(expected, entityType.GetName());
        }

        [Theory]
        [InlineData(EntityType.Animation, "animations")]
        [InlineData(EntityType.Background, "backgrounds")]
        public void TestGroupName(EntityType entityType, string expected)
        {
            Assert.Equal(expected, entityType.GetGroupName());
        }
    }
}
