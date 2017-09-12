using Grafika.Animations;
using Grafika.Services;
using Grafika.Services.Animations;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services.Animations
{
    public class AnimationServiceTest
    {
        [Fact]
        public async void TestDelete()
        {
            var target = new Animation { Id = "toDelete", IsRemoved = false };

            var mockRepo = new Mock<IAnimationRepository>();
            mockRepo.Setup(c => c.First(It.IsAny<AnimationQueryOptions>()))
                .ReturnsAsync(target)
                .Verifiable();
            mockRepo.Setup(c => c.Update(It.Is<Animation>(anim => anim.Id == "toDelete")))
                .ReturnsAsync(new Animation { Id = "wasDeleted " })
                .Verifiable();

            var mockValidator = new Mock<IAnimationValidator>();
            mockValidator.Setup(c => c.Validate(It.IsAny<Animation>()))
                .Verifiable();
            mockValidator.Setup(c => c.ValidateId(It.IsAny<string>()))
                .Returns(true)
                .Verifiable();

            var service = new AnimationService(MockHelpers.ServiceContext.Object, mockRepo.Object, mockValidator.Object);
            var animation = await service.Delete("toDelete");

            Assert.Equal(true, target.IsRemoved);
            Assert.NotNull(target.DateModified);

            mockRepo.VerifyAll();
            mockValidator.VerifyAll();
        }

        [Fact]
        public async void TestBulkDeleteAnimations()
        {
            var mockRepo = new Mock<IAnimationRepository>();
            mockRepo.Setup(c => c.RemoveByIds(It.IsAny<IEnumerable<string>>()))
                .Returns(Task.FromResult(0))
                .Verifiable();

            var service = new AnimationService(MockHelpers.ServiceContext.Object, mockRepo.Object, null);
            await service.Delete(new string[] { "1", "2" });

            mockRepo.VerifyAll();
        }

        [Fact]
        public void TestPrepareQueryOptions_TermIsAnId()
        {
            var mockValidator = new Mock<IAnimationValidator>();
            mockValidator.Setup(c => c.ValidateId(It.IsAny<string>()))
                .Returns(true)
                .Verifiable();

            var queryOptions = new AnimationQueryOptions { Term = "IsAnId", IsRemoved = true, IsPublic = true };
            var service = new AnimationService(MockHelpers.ServiceContext.Object, null, mockValidator.Object);
            var result = service.PrepareQueryOptions(queryOptions);

            Assert.Equal("IsAnId", result.Id);
            Assert.Null(result.Term);
            Assert.Null(result.IsRemoved);
            Assert.Null(result.IsPublic);
        }
    }
}
