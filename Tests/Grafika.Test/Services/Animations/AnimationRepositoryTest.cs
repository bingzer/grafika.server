using Grafika.Services.Animations;
using System.Collections.Generic;
using Xunit;
using Grafika.Data;
using Grafika.Animations;
using System.Linq;
using System.Threading.Tasks;
using Moq;

namespace Grafika.Test.Services.Animations
{
    public class AnimationRepositoryTest
    {
        readonly List<Animation> _animations = new List<Animation>
        {
            new Animation { Id = "1", Name = "1", UserId = "user1", IsPublic = true, IsRemoved = false, Views = 1, Rating = 5, TotalFrame = 10 },
            new Animation { Id = "2", Name = "2", UserId = "user1", IsPublic = true, IsRemoved = true, Views = 2, Rating = 4, TotalFrame = 10 },
            new Animation { Id = "3", Name = "3", UserId = "user2", IsPublic = true, IsRemoved = false, Views = 3, Rating = 3, TotalFrame = 10 },
            new Animation { Id = "4", Name = "4", UserId = "user3", IsPublic = false, IsRemoved = false, Views = 4, Rating = 2, TotalFrame = 10 },
            // should get excluded
            new Animation { Id = "5", Name = "5", UserId = "user3", IsPublic = false, IsRemoved = false, Views = 4, Rating = 2, TotalFrame = 0 },
        };

        [Fact]
        public async void TestFind_DefaultQueryOptions()
        {
            var repo = await SetupAnimationRepository();
            var options = new AnimationQueryOptions();
            var results = await repo.Find(options);

            Assert.Equal(4, results.Count());
        }

        [Theory]
        [InlineData("1")]
        [InlineData("2")]
        [InlineData("3")]
        [InlineData("4")]
        public async void TestFind_Id(string animationId)
        {
            var repo = await SetupAnimationRepository();
            var options = new AnimationQueryOptions { Id = animationId };
            var results = await repo.Find(options);
            var result = results.First();

            Assert.Equal(animationId, result.Id);
        }

        [Theory]
        [InlineData("user1", 2)]
        [InlineData("user2", 1)]
        [InlineData("user3", 1)]
        public async void TestFind_UserId(string userId, int expectedCount)
        {
            var repo = await SetupAnimationRepository();
            var options = new AnimationQueryOptions { UserId = userId };
            var results = await repo.Find(options);

            Assert.Equal(expectedCount, results.Count());
        }

        [Theory]
        [InlineData(true, 3)]
        [InlineData(false, 1)]
        public async void TestFind_IsPublic(bool isPublic, int expectedCount)
        {
            var repo = await SetupAnimationRepository();
            var options = new AnimationQueryOptions { IsPublic = isPublic };
            var results = await repo.Find(options);

            Assert.Equal(expectedCount, results.Count());
        }

        [Theory]
        [InlineData(true, 1)]
        [InlineData(false, 3)]
        public async void TestFind_IsRemoved(bool isRemoved, int expectedCount)
        {
            var repo = await SetupAnimationRepository();
            var options = new AnimationQueryOptions { IsRemoved = isRemoved };
            var results = await repo.Find(options);

            Assert.Equal(expectedCount, results.Count());
        }

        [Fact]
        public async void TestFind_Complex()
        {
            var repo = await SetupAnimationRepository();
            var options = new AnimationQueryOptions { UserId = "user1", IsRemoved = true };
            var results = await repo.Find(options);

            Assert.Equal(1, results.Count());
            Assert.Equal("2", results.First().Id);

            options = new AnimationQueryOptions { UserId = "user1", IsRemoved = true, IsPublic = false };
            results = await repo.Find(options);
            Assert.Equal(0, results.Count());
        }

        [Fact]
        public async void TestSort()
        {
            var repo = await SetupAnimationRepository();
            var options = new AnimationQueryOptions { Sort = new SortOptions { Direction = SortDirection.Ascending, Name = "views" } };
            var results = (await repo.Find(options)).ToList();
            Assert.Equal("1", results[0].Id);
            Assert.Equal("2", results[1].Id);
            Assert.Equal("3", results[2].Id);
            Assert.Equal("4", results[3].Id);

            options = new AnimationQueryOptions { Sort = new SortOptions { Direction = SortDirection.Descending, Name = "views" } };
            results = (await repo.Find(options)).ToList();
            Assert.Equal("4", results[0].Id);
            Assert.Equal("3", results[1].Id);
            Assert.Equal("2", results[2].Id);
            Assert.Equal("1", results[3].Id);

            options = new AnimationQueryOptions { Sort = new SortOptions { Direction = SortDirection.Ascending, Name = "rating" } };
            results = (await repo.Find(options)).ToList();
            Assert.Equal("4", results[0].Id);
            Assert.Equal("3", results[1].Id);
            Assert.Equal("2", results[2].Id);
            Assert.Equal("1", results[3].Id);


            options = new AnimationQueryOptions { Sort = new SortOptions { Direction = SortDirection.Descending, Name = "rating" } };
            results = (await repo.Find(options)).ToList();
            Assert.Equal("1", results[0].Id);
            Assert.Equal("2", results[1].Id);
            Assert.Equal("3", results[2].Id);
            Assert.Equal("4", results[3].Id);
        }

        [Fact]
        public async void TestRandom()
        {
            var repo = await SetupAnimationRepository();
            var options = new AnimationQueryOptions { IsRandom = true };
            var results = await repo.Find(options);

            Assert.Equal(true, results.Any());
            Assert.NotNull(results.ToList()[0]);
        }

        [Fact]
        public async void TestRelatedToAnimations()
        {
            var repo = await SetupAnimationRepository();
            var options = new AnimationQueryOptions { RelatedToAnimationId = "1" };
            var results = await repo.Find(options);

            // should not include animatioNid = 1
            Assert.Equal(false, results.Any(a => a.Id == "1"));
        }

        [Fact]
        public async void TestTextSearch()
        {
            var options = new AnimationQueryOptions { Term = "bla bla" };

            var mockTextSearchProvider = new Mock<ITextSearchProvider<Animation, AnimationQueryOptions>>();
            mockTextSearchProvider
                .Setup(c => c.TextSearchAsync(It.IsAny<IDataSet<Animation>>(), It.Is<AnimationQueryOptions>(opt => opt.Term == options.Term)))
                .Returns(Task.FromResult<IEnumerable<Animation>>(new List<Animation>()))
                .Verifiable();

            var repo = await SetupAnimationRepository(mockTextSearchProvider.Object);
            await repo.Find(options);

            mockTextSearchProvider.VerifyAll();
        }

        [Fact]
        public async void TestBulkRemove()
        {
            var mockBulkRemoveProvider = new Mock<IBulkRemoveProvider<Animation>>();
            mockBulkRemoveProvider
                .Setup(c => c.BulkRemove(It.IsAny<IDataSet<Animation>>(), It.IsAny<IEnumerable<string>>()))
                .Returns(Task.FromResult(0))
                .Verifiable();

            var repo = await SetupAnimationRepository(removeProvider: mockBulkRemoveProvider.Object);
            await repo.RemoveByIds(new string[0]);

            mockBulkRemoveProvider.VerifyAll();
        }


        private async Task<AnimationRepository> SetupAnimationRepository(
            ITextSearchProvider<Animation, AnimationQueryOptions> searchProvider = null,
            IBulkRemoveProvider<Animation> removeProvider = null)
        {
            var context = new InMemoryDataContext();
            foreach (var anim in _animations)
            {
                await context.Animations.AddAsync(anim);
            }

            return new AnimationRepository(context, searchProvider, removeProvider);
        }
    }
}
