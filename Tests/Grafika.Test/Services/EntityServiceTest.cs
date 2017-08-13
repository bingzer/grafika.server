using Grafika.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services
{
    public class EntityServiceTest
    {
        [Fact]
        public async void TestList()
        {
            var mockRepo = new Mock<IRepository<BaseEntity, QueryOptions>>();
            mockRepo.Setup(c => c.Find(It.IsAny<QueryOptions>()))
                .ReturnsAsync(new List<BaseEntity> { new BaseEntity() })
                .Verifiable();

            var mockValidator = new Mock<IEntityValidator<BaseEntity>>();
            mockValidator.Setup(c => c.Sanitize(It.IsAny<BaseEntity>(), It.IsAny<IUser>()))
                .Verifiable();

            var entityService = new SimpleEntityService(MockHelpers.ServiceContext.Object, mockRepo.Object, mockValidator.Object);
            await entityService.List(new QueryOptions());

            mockRepo.VerifyAll();
            mockValidator.VerifyAll();
        }

        [Fact]
        public async void TestGet_NotFound()
        {
            var mockRepo = new Mock<IRepository<BaseEntity, QueryOptions>>();
            mockRepo.Setup(c => c.First(It.IsAny<QueryOptions>()))
                .ReturnsAsync((BaseEntity) null)
                .Verifiable();

            var mockValidator = new Mock<IEntityValidator<BaseEntity>>();
            mockValidator.Setup(c => c.ValidateId(It.IsAny<string>()))
                .Returns(true)
                .Verifiable();

            var entityService = new SimpleEntityService(MockHelpers.ServiceContext.Object, mockRepo.Object, mockValidator.Object);

            await Assert.ThrowsAsync<NotFoundExeption>(() => entityService.Get("id"));

            mockRepo.VerifyAll();
            mockValidator.VerifyAll();
        }


        [Fact]
        public async void TestGet_Found()
        {
            var mockRepo = new Mock<IRepository<BaseEntity, QueryOptions>>();
            mockRepo.Setup(c => c.First(It.IsAny<QueryOptions>()))
                .ReturnsAsync(new BaseEntity { Id = "id" })
                .Verifiable();

            var mockValidator = new Mock<IEntityValidator<BaseEntity>>();
            mockValidator.Setup(c => c.Sanitize(It.Is<BaseEntity>(entity => entity.Id == "id"), It.IsAny<IUser>()))
                .Verifiable();
            mockValidator.Setup(c => c.ValidateId(It.IsAny<string>()))
                .Returns(true)
                .Verifiable();

            var entityService = new SimpleEntityService(MockHelpers.ServiceContext.Object, mockRepo.Object, mockValidator.Object);

            await entityService.Get("id");

            mockRepo.VerifyAll();
            mockValidator.VerifyAll();
        }

        [Fact]
        public async void TestCreate()
        {
            var mockRepo = new Mock<IRepository<BaseEntity, QueryOptions>>();
            mockRepo.Setup(c => c.Add(It.Is<BaseEntity>(entity => entity.Id == "id")))
                .ReturnsAsync(new BaseEntity { Id = "id" })
                .Verifiable();

            var mockValidator = new Mock<IEntityValidator<BaseEntity>>();
            mockValidator.Setup(c => c.Validate(It.Is<BaseEntity>(entity => entity.Id == "id")))
                .Verifiable();

            var entityService = new SimpleEntityService(MockHelpers.ServiceContext.Object, mockRepo.Object, mockValidator.Object);

            await entityService.Create(new BaseEntity { Id = "id" });

            mockRepo.VerifyAll();
            mockValidator.VerifyAll();

            await Assert.ThrowsAsync<ArgumentNullException>(() => entityService.Create(null));
        }

        [Fact]
        public async void TestUpdate()
        {
            var mockRepo = new Mock<IRepository<BaseEntity, QueryOptions>>();
            mockRepo.Setup(c => c.Update(It.Is<BaseEntity>(entity => entity.Id == "id")))
                .ReturnsAsync(new BaseEntity { Id = "id" })
                .Verifiable();

            var mockValidator = new Mock<IEntityValidator<BaseEntity>>();

            var entityService = new SimpleEntityService(MockHelpers.ServiceContext.Object, mockRepo.Object, mockValidator.Object);

            await entityService.Update(new BaseEntity { Id = "id" });

            mockRepo.VerifyAll();
            mockValidator.VerifyAll();

            await Assert.ThrowsAsync<ArgumentNullException>(() => entityService.Create(null));
        }

        [Fact]
        public async void TestDelete()
        {
            var deleteEntity = new BaseEntity { Id = "id" };

            var mockRepo = new Mock<IRepository<BaseEntity, QueryOptions>>();
            mockRepo.Setup(c => c.First(It.IsAny<QueryOptions>()))
                .ReturnsAsync(deleteEntity)
                .Verifiable();
            mockRepo.Setup(c => c.Remove(It.Is<BaseEntity>(entity => entity.Id == "id")))
                .ReturnsAsync(deleteEntity)
                .Verifiable();

            var mockValidator = new Mock<IEntityValidator<BaseEntity>>();
            mockValidator.Setup(c => c.ValidateId(It.IsAny<string>()))
                .Returns(true)
                .Verifiable();

            var entityService = new SimpleEntityService(MockHelpers.ServiceContext.Object, mockRepo.Object, mockValidator.Object);
            await entityService.Delete("id");

            mockRepo.VerifyAll();
            mockValidator.VerifyAll();
        }
    }

    class SimpleEntityService : EntityService<BaseEntity, QueryOptions, IRepository<BaseEntity, QueryOptions>>
    {
        public SimpleEntityService(IServiceContext context, IRepository<BaseEntity, QueryOptions> repository, IEntityValidator<BaseEntity> validator) 
            : base(context, repository, validator)
        {
        }

        protected internal override Task<BaseEntity> CreateEntityForUpdate(BaseEntity source)
        {
            return Task.FromResult(source);
        }

        protected internal override Task<BaseEntity> PrepareEntityForCreate(BaseEntity source)
        {
            return Task.FromResult(source);
        }
    }
}
