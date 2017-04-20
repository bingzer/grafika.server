using Grafika.Data.Mongo;
using MongoDB.Driver;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Data.Mongo
{
    public class MongoDataSetTest
    {
        [Fact]
        public async void TestAddAsync()
        {
            var mockCollection = new Mock<IMongoCollection<BaseEntity>>();

            var entityToInsert = new BaseEntity { Id = "BaseEntityId" };

            var dataSet = new TestingMongoDataSet(mockCollection.Object);
            var entity = await dataSet.AddAsync(entityToInsert);

            mockCollection.Verify(c => 
                c.InsertOneAsync(
                    It.Is<BaseEntity>(e => e.Id == entityToInsert.Id),
                    It.IsAny<InsertOneOptions>(),
                    It.IsAny<CancellationToken>()
                    )
            );
        }

        [Fact]
        public async void TestFindAsync()
        {
            var entityToFind = new BaseEntity { Id = "BaseEntityId" };


            var mockCursor = new Mock<IAsyncCursor<BaseEntity>>();
            mockCursor.Setup(c => c.Current).Returns(new List<BaseEntity>() { entityToFind });
            mockCursor.Setup(c => c.MoveNextAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(true));
            var mockCollection = new Mock<IMongoCollection<BaseEntity>>();
            mockCollection.Setup(c =>
                c.FindAsync(
                    It.IsAny<ExpressionFilterDefinition<BaseEntity>>(),
                    It.IsAny<FindOptions<BaseEntity, BaseEntity>>(),
                    It.IsAny<CancellationToken>()
                    )
                ).Returns(() => {
                    return Task.FromResult(mockCursor.Object);
                });

            var dataSet = new TestingMongoDataSet(mockCollection.Object);
            var entity = await dataSet.FindAsync(entityToFind);

            mockCollection.Verify(c =>
                c.FindAsync(
                    It.IsAny<ExpressionFilterDefinition<BaseEntity>>(),
                    It.IsAny<FindOptions<BaseEntity, BaseEntity>>(),
                    It.IsAny<CancellationToken>()
                    )
            );
        }

        [Fact]
        public async void TestRemoveAsync()
        {
            var mockCollection = new Mock<IMongoCollection<BaseEntity>>();

            var entityToRemove = new BaseEntity { Id = "BaseEntityId" };

            var dataSet = new TestingMongoDataSet(mockCollection.Object);
            var entity = await dataSet.RemoveAsync(entityToRemove);

            mockCollection.Verify(c =>
                c.DeleteOneAsync(
                    It.IsAny<ExpressionFilterDefinition<BaseEntity>>(),
                    It.IsAny<DeleteOptions>(),
                    It.IsAny<CancellationToken>()
                    )
            );
        }

        [Fact]
        public async void TestUpdateAsync()
        {
            var mockCollection = new Mock<IMongoCollection<BaseEntity>>();

            var entityToUpdate = new BaseEntity { Id = "BaseEntityId" };

            var dataSet = new TestingMongoDataSet(mockCollection.Object);
            var entity = await dataSet.UpdateAsync(entityToUpdate);

            mockCollection.Verify(c =>
                c.UpdateOneAsync(
                    It.IsAny<ExpressionFilterDefinition<BaseEntity>>(),
                    It.IsAny<UpdateDefinition<BaseEntity>>(),
                    It.IsAny<UpdateOptions>(),
                    It.IsAny<CancellationToken>()
                    )
            );
        }

        class TestingMongoDataSet : MongoDataSet<BaseEntity>
        {
            public TestingMongoDataSet(IMongoCollection<BaseEntity> collection) : base(collection)
            {
            }

            public override Task EnsureIndex()
            {
                return Task.FromResult(0);
            }
        }
    }
}
