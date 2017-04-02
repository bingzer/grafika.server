using Grafika.Animations;
using Grafika.Services;
using Grafika.Services.Syncs;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services.Syncs
{
    public class SyncServiceTest
    {
        [Fact]
        public async void TestFindServerChanges()
        {
            var removedAnimations = new List<Animation>
            {
                new Animation { Id = "removed1" },
                new Animation { Id = "removed2" }
            };
            var animations = new List<Animation> { new Animation { Id = "animation1" } };

            var mockRepo = new Mock<IAnimationRepository>();
            mockRepo.Setup(c => c.Find(It.Is<AnimationQueryOptions>(opt => opt.IsRemoved == false)))
                .Returns(Task.FromResult<IEnumerable<Animation>>(animations));
            mockRepo.Setup(c => c.Find(It.Is<AnimationQueryOptions>(opt => opt.IsRemoved == true)))
                .Returns(Task.FromResult<IEnumerable<Animation>>(removedAnimations));

            var service = new SyncService(MockHelpers.ServiceProvider.Object, mockRepo.Object, MockHelpers.ServiceContext.Object);
            var serverChanges = await service.FindServerChanges("bla");

            Assert.Equal("bla", serverChanges.UserId);

            var trash = serverChanges.Tombstones.ToList();
            Assert.True(trash.Count == 2);
            Assert.True(trash.Any(anim => anim.Id == "removed1"));
            Assert.True(trash.Any(anim => anim.Id == "removed2"));

            var anims = serverChanges.Animations.ToList();
            Assert.True(anims.Count == 1);
            Assert.True(anims.Any(anim => anim.Id == "animation1"));
        }
    }
}
