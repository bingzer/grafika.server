using Grafika.Data;
using Moq;
using Xunit;
using System;
using Grafika.Services;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Grafika.Test.Services
{
    public class RepositoryBaseTest
    {
        [Fact]
        public async void TestFirst()
        {
            var mockContext = new Mock<IDataContext>();
            var repo = new GenericRepository(mockContext.Object);

            var entity = await repo.First();
            Assert.Equal("1", entity.Id);
        }

        [Fact]
        public async void TestAny()
        {
            var mockContext = new Mock<IDataContext>();
            var repo = new GenericRepository(mockContext.Object);

            var actual = await repo.Any(new QueryOptions { Id = "2" });
            Assert.Equal(true, actual);

            actual = await repo.Any(new QueryOptions { Id = "20" });
            Assert.Equal(false, actual);
        }

        [Fact]
        public async void TestFind()
        {
            var mockContext = new Mock<IDataContext>();
            var repo = new GenericRepository(mockContext.Object);

            var results = await repo.Find();
            Assert.Equal(5, results.Count());
        }

        [Fact]
        public async void TestFind_Paging()
        {
            var mockContext = new Mock<IDataContext>();
            var repo = new GenericRepository(mockContext.Object);

            var results = (IPaging<Entity>) await repo.Find(new QueryOptions { PageSize = 2 });
            Assert.IsAssignableFrom<IPaging>(results);
            Assert.Equal(2, results.Count());
        }

        [Fact]
        public async void TestRemove()
        {
            var mockDataset = new Mock<IDataSet<Entity>>();
            var mockContext = new Mock<IDataContext>();
            mockContext.Setup(c => c.Set<Entity>()).Returns(mockDataset.Object);

            var repo = new GenericRepository(mockContext.Object);
            await repo.Remove(new Entity { Id = "3" });

            mockContext.Verify(c => c.Set<Entity>());
            mockDataset.Verify(c => c.RemoveAsync(It.Is<Entity>(e => e.Id == "3")));
        }

        [Fact]
        public async void TestUpdate()
        {
            var mockDataset = new Mock<IDataSet<Entity>>();
            var mockContext = new Mock<IDataContext>();
            mockContext.Setup(c => c.Set<Entity>()).Returns(mockDataset.Object);

            var repo = new GenericRepository(mockContext.Object);
            await repo.Update(new Entity { Id = "3" });

            mockContext.Verify(c => c.Set<Entity>());
            mockDataset.Verify(c => c.UpdateAsync(It.Is<Entity>(e => e.Id == "3")));
        }
    }


    public class Entity : IEntity
    {
        public string Id { get; set; }
    }

    public class GenericRepository : RepositoryBase<IDataContext, Entity, QueryOptions>
    {
        private readonly List<Entity> _list = new List<Entity>();

        public GenericRepository(IDataContext dataContext) : base(dataContext)
        {
            _list.Add(new Entity { Id = "1" });
            _list.Add(new Entity { Id = "2" });
            _list.Add(new Entity { Id = "3" });
            _list.Add(new Entity { Id = "4" });
            _list.Add(new Entity { Id = "5" });
        }

        protected override Task<IEnumerable<Entity>> Query(QueryOptions options = null)
        {
            var query = _list.AsQueryable();

            if (!string.IsNullOrEmpty(options.Id))
                query = query.Where(item => item.Id == options.Id);

            return Task.FromResult<IEnumerable<Entity>>(query);
        }
    }
}
