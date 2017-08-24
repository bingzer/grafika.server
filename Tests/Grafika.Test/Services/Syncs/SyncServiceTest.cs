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

            var mockAnimationRepo = new Mock<IAnimationRepository>();
            mockAnimationRepo.Setup(c => c.Find(It.Is<AnimationQueryOptions>(opt => opt.IsRemoved == false)))
                .Returns(Task.FromResult<IEnumerable<Animation>>(animations))
                .Verifiable();
            mockAnimationRepo.Setup(c => c.Find(It.Is<AnimationQueryOptions>(opt => opt.IsRemoved == true)))
                .Returns(Task.FromResult<IEnumerable<Animation>>(removedAnimations))
                .Verifiable();
            var mockBackgroundRepo = new Mock<IBackgroundRepository>();
            mockBackgroundRepo.Setup(c => c.Find(It.Is<BackgroundQueryOptions>(opt => opt.IsRemoved == false)))
                .ReturnsAsync(new List<Background>())
                .Verifiable();
            mockBackgroundRepo.Setup(c => c.Find(It.Is<BackgroundQueryOptions>(opt => opt.IsRemoved == true)))
                .ReturnsAsync(new List<Background>())
                .Verifiable();

            var mockServiceContext = MockHelpers.ServiceContext;

            var service = new SyncService(mockServiceContext.Object, mockAnimationRepo.Object, mockBackgroundRepo.Object);
            var serverChanges = await service.FindServerChanges("bla");

            Assert.Equal("bla", serverChanges.UserId);

            var trash = serverChanges.Tombstones.ToList();
            Assert.True(trash.Count == 2);
            Assert.True(trash.Any(anim => anim.Id == "removed1"));
            Assert.True(trash.Any(anim => anim.Id == "removed2"));

            var anims = serverChanges.Animations.ToList();
            Assert.True(anims.Count == 1);
            Assert.True(anims.Any(anim => anim.Id == "animation1"));

            mockAnimationRepo.VerifyAll();
            mockBackgroundRepo.VerifyAll();
        }

        [Fact]
        public async void TestFindServerChanges_WithBackgrounds()
        {
            var removedAnimations = new List<Animation>
            {
                new Animation { Id = "removed1" },
                new Animation { Id = "removed2" }
            };
            var animations = new List<Animation> { new Animation { Id = "animation1" } };
            var removedBackgrounds = new List<Background>
            {
                new Background { Id = "removedBackground1" },
                new Background { Id = "removedBackground2" }
            };
            var backgrounds = new List<Background> { new Background { Id = "background1" } };

            var mockAnimationRepo = new Mock<IAnimationRepository>();
            mockAnimationRepo.Setup(c => c.Find(It.Is<AnimationQueryOptions>(opt => opt.IsRemoved == false)))
                .Returns(Task.FromResult<IEnumerable<Animation>>(animations));
            mockAnimationRepo.Setup(c => c.Find(It.Is<AnimationQueryOptions>(opt => opt.IsRemoved == true)))
                .Returns(Task.FromResult<IEnumerable<Animation>>(removedAnimations));
            var mockBackgroundRepo = new Mock<IBackgroundRepository>();
            mockBackgroundRepo.Setup(c => c.Find(It.Is<BackgroundQueryOptions>(opt => opt.IsRemoved == false)))
                .Returns(Task.FromResult<IEnumerable<Background>>(backgrounds));
            mockBackgroundRepo.Setup(c => c.Find(It.Is<BackgroundQueryOptions>(opt => opt.IsRemoved == true)))
                .Returns(Task.FromResult<IEnumerable<Background>>(removedBackgrounds));

            var mockServiceContext = MockHelpers.ServiceContext;

            var service = new SyncService(mockServiceContext.Object, mockAnimationRepo.Object, mockBackgroundRepo.Object);
            var serverChanges = await service.FindServerChanges("bla");

            Assert.Equal("bla", serverChanges.UserId);

            var trash = serverChanges.Tombstones.ToList();
            Assert.True(trash.Count == 2);
            Assert.True(trash.Any(anim => anim.Id == "removed1"));
            Assert.True(trash.Any(anim => anim.Id == "removed2"));

            var anims = serverChanges.Animations.ToList();
            Assert.True(anims.Count == 1);
            Assert.True(anims.Any(anim => anim.Id == "animation1"));

            var backgroundTrash = serverChanges.BackgroundTombstones.ToList();
            Assert.True(backgroundTrash.Count == 2);
            Assert.True(backgroundTrash.Any(back => back.Id == "removedBackground1"));
            Assert.True(backgroundTrash.Any(back => back.Id == "removedBackground2"));

            var backs = serverChanges.Backgrounds.ToList();
            Assert.True(backs.Count == 1);
            Assert.True(backs.Any(back => back.Id == "background1"));

            mockAnimationRepo.VerifyAll();
            mockBackgroundRepo.VerifyAll();
        }
    }
}
