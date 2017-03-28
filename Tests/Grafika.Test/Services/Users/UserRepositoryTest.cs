using Grafika.Data;
using Grafika.Services.Users;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services.Users
{
    public class UserRepositoryTest
    {

        private List<User> _userList = new List<User>
        {
            new User{
                Id = "user1",
                Email = "user1@email.com",
                FirstName = "user",
                LastName = "1",
                Username = "user1",
                Activation = new UserActivation { Hash = "hashForUser1", Timestamp = DateTime.UtcNow },
                Local = new UserLocal { IsRegistered = true, Password = "passForUser1" },
                Stats = new UserStats { DateLastSeen = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() }
            },
            new User{
                Id = "user2",
                Email = "user2@email.com",
                FirstName = "user",
                LastName = "2",
                Username = "user2",
                Activation = new UserActivation { Hash = "hashForUser2", Timestamp = DateTime.UtcNow },
                Local = new UserLocal { IsRegistered = true, Password = "passForUser2" },
                Stats = new UserStats { DateLastSeen = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() }
            }
        };

        [Fact]
        public async void TestFind_DefaultQueryOptions()
        {
            var userRepo = await SetupUserRepository();
            var results = await userRepo.Find();

            Assert.Equal(2, results.Count());
        }

        [Theory]
        [InlineData("user1")]
        [InlineData("user2")]
        public async void TestFind_Id(string userId)
        {
            var userRepo = await SetupUserRepository();
            var results = await userRepo.Find(new UserQueryOptions { Id = userId });

            Assert.Equal(1, results.Count());
            Assert.Equal(userId, results.ToList()[0].Username);
        }

        [Theory]
        [InlineData("user1@email.com", "user1")]
        [InlineData("user2@email.com", "user2")]
        public async void TestFind_Email(string email, string username)
        {
            var userRepo = await SetupUserRepository();
            var results = await userRepo.Find(new UserQueryOptions { Email = email });

            Assert.Equal(1, results.Count());
            Assert.Equal(email, results.ToList()[0].Email);
            Assert.Equal(username, results.ToList()[0].Username);
        }

        [Theory]
        [InlineData("user1@email.com", "user1")]
        [InlineData("user2@email.com", "user2")]
        public async void TestFind_Username(string email, string username)
        {
            var userRepo = await SetupUserRepository();
            var results = await userRepo.Find(new UserQueryOptions { Username = username });

            Assert.Equal(1, results.Count());
            Assert.Equal(email, results.ToList()[0].Email);
            Assert.Equal(username, results.ToList()[0].Username);
        }

        [Fact]
        public async void TestFind_NotFound()
        {
            var userRepo = await SetupUserRepository();
            var results = await userRepo.Find(new UserQueryOptions { Email = "user12@email.com" });
            Assert.Equal(0, results.Count());

            results = await userRepo.Find(new UserQueryOptions { Id = "123456" });
            Assert.Equal(0, results.Count());

            results = await userRepo.Find(new UserQueryOptions { Username = "123456" });
            Assert.Equal(0, results.Count());
        }

        [Fact]
        public async void TestCheckUsernameAvailability()
        {
            var userRepo = await SetupUserRepository();

            var caller = new User("user1");
            await userRepo.CheckUsernameAvailability(caller, "user1");   // itself -> good
            await Assert.ThrowsAsync<NotValidException>(() => userRepo.CheckUsernameAvailability(caller, "user2"));  // taken -> bad
            await userRepo.CheckUsernameAvailability(caller, "user3");   // user3 is not taken -> good

            caller = new User("user2");
            await Assert.ThrowsAsync<NotValidException>(() => userRepo.CheckUsernameAvailability(caller, "user1"));  // taken -> bad
            await userRepo.CheckUsernameAvailability(caller, "user2");   // itself -> good
            await userRepo.CheckUsernameAvailability(caller, "user3");   // user3 is not taken -> good
        }

        [Fact]
        public async void TestTextSearch()
        {
            var mockTextSearchProvider = new Mock<ITextSearchProvider<User, UserQueryOptions>>();
            mockTextSearchProvider.Setup(c => c.TextSearchAsync(It.IsAny<IDataSet<User>>(), It.IsAny<UserQueryOptions>()))
                .Returns(Task.FromResult<IEnumerable<User>>(new List<User>()))
                .Verifiable();

            var userRepo = await SetupUserRepository(mockTextSearchProvider.Object);
            await userRepo.Find(new UserQueryOptions { Term = "sdf" });

            mockTextSearchProvider.VerifyAll();
        }


        private async Task<UserRepository> SetupUserRepository(
            ITextSearchProvider<User, UserQueryOptions> textSearchProvider = null)
        {
            var context = new InMemoryDataContext();
            foreach (var user in _userList)
            {
                await context.Users.AddAsync(user);
            }

            return new UserRepository(context, textSearchProvider);
        }
    }
}
