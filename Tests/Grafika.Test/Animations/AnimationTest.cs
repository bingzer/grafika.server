using Grafika.Animations;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Animations
{
    public class AnimationTest
    {
        [Fact]
        public void TestEquals()
        {
            // should only check the id && local Id
            var animA = new Animation { Id = "A", LocalId = "LocalId", Name = "NameA" };
            var animB = new Animation { Id = "A", LocalId = "LocalId", Name = "NameB" };
            Assert.Equal(animA, animB);

            // should only check the id && local Id
            animA = new Animation { Id = "A", LocalId = "LocalId", Name = "NameA" };
            animB = new Animation { Id = "B", LocalId = "LocalId", Name = "NameB" };
            Assert.Equal(animA, animB);

            // should only check the id && local Id
            animA = new Animation { Id = "A", LocalId = "LocalIdA", Name = "NameA" };
            animB = new Animation { Id = "A", LocalId = "LocalIdB", Name = "NameB" };
            Assert.Equal(animA, animB);

            // should only check the id && local Id
            animA = new Animation { Id = "A", LocalId = "LocalIdA", Name = "NameA" };
            animB = new Animation { Id = "B", LocalId = "LocalIdB", Name = "NameB" };
            Assert.NotEqual(animA, animB);
        }
    }
}
