using Grafika.Services.Backgrounds;
using System.Collections.Generic;
using Xunit;
using Grafika.Data;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Grafika.Animations;

namespace Grafika.Test.Services.Backgrounds
{
    public class BackgroundRepositoryTest
    {
        readonly List<Background> _animations = new List<Background>
        {
            new Background { Id = "1", Name = "1", UserId = "user1", IsPublic = true, IsRemoved = false },
            new Background { Id = "2", Name = "2", UserId = "user1", IsPublic = true, IsRemoved = true },
            new Background { Id = "3", Name = "3", UserId = "user2", IsPublic = true, IsRemoved = false },
            new Background { Id = "4", Name = "4", UserId = "user3", IsPublic = false, IsRemoved = false }
        };

        [Fact]
        public async void TestFind_DefaultQueryOptions()
        {
            var repo = await SetupBackgroundRepository();
            var options = new BackgroundQueryOptions();
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
            var repo = await SetupBackgroundRepository();
            var options = new BackgroundQueryOptions { Id = animationId };
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
            var repo = await SetupBackgroundRepository();
            var options = new BackgroundQueryOptions { UserId = userId };
            var results = await repo.Find(options);

            Assert.Equal(expectedCount, results.Count());
        }

        [Theory]
        [InlineData(true, 3)]
        [InlineData(false, 1)]
        public async void TestFind_IsPublic(bool isPublic, int expectedCount)
        {
            var repo = await SetupBackgroundRepository();
            var options = new BackgroundQueryOptions { IsPublic = isPublic };
            var results = await repo.Find(options);

            Assert.Equal(expectedCount, results.Count());
        }

        [Theory]
        [InlineData(true, 1)]
        [InlineData(false, 3)]
        public async void TestFind_IsRemoved(bool isRemoved, int expectedCount)
        {
            var repo = await SetupBackgroundRepository();
            var options = new BackgroundQueryOptions { IsRemoved = isRemoved };
            var results = await repo.Find(options);

            Assert.Equal(expectedCount, results.Count());
        }

        [Fact]
        public async void TestFind_Complex()
        {
            var repo = await SetupBackgroundRepository();
            var options = new BackgroundQueryOptions { UserId = "user1", IsRemoved = true };
            var results = await repo.Find(options);

            Assert.Equal(1, results.Count());
            Assert.Equal("2", results.First().Id);

            options = new BackgroundQueryOptions { UserId = "user1", IsRemoved = true, IsPublic = false };
            results = await repo.Find(options);
            Assert.Equal(0, results.Count());
        }

        [Fact]
        public async void TestTextSearch()
        {
            var options = new BackgroundQueryOptions { Term = "bla bla" };

            var mockTextSearchProvider = new Mock<ITextSearchProvider<Background, BackgroundQueryOptions>>();
            mockTextSearchProvider
                .Setup(c => c.TextSearchAsync(It.IsAny<IDataSet<Background>>(), It.Is<BackgroundQueryOptions>(opt => opt.Term == options.Term)))
                .Returns(Task.FromResult<IEnumerable<Background>>(new List<Background>()))
                .Verifiable();

            var repo = await SetupBackgroundRepository(mockTextSearchProvider.Object);
            await repo.Find(options);

            mockTextSearchProvider.VerifyAll();
        }

        [Fact]
        public async void TestBulkRemove()
        {
            var mockBulkRemoveProvider = new Mock<IBulkRemoveProvider<Background>>();
            mockBulkRemoveProvider
                .Setup(c => c.BulkRemove(It.IsAny<IDataSet<Background>>(), It.IsAny<IEnumerable<string>>()))
                .Returns(Task.FromResult(0))
                .Verifiable();

            var repo = await SetupBackgroundRepository(removeProvider: mockBulkRemoveProvider.Object);
            await repo.RemoveByIds(new string[0]);

            mockBulkRemoveProvider.VerifyAll();
        }


        private async Task<BackgroundRepository> SetupBackgroundRepository(
            ITextSearchProvider<Background, BackgroundQueryOptions> searchProvider = null,
            IBulkRemoveProvider<Background> removeProvider = null)
        {
            var context = new InMemoryDataContext();
            foreach (var anim in _animations)
            {
                await context.Backgrounds.AddAsync(anim);
            }

            return new BackgroundRepository(context, searchProvider, removeProvider);
        }
    }
}
