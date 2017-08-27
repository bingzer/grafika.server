using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Accounts;
using Grafika.Services.Accounts.Stores;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using System;
using System.Security.Claims;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Grafika.Services.Accounts.Tokens;
using Grafika.Utilities;

namespace Grafika.Test.Services.Accounts
{
    public class AccountServiceTest
    {
        BCryptPasswordHasher passwordHasher = new BCryptPasswordHasher();
        IdentityErrorDescriber errorDescriber;
        ServerConfiguration serverConfig;
        EmailConfiguration emailConfig;

        Mock<IServiceContext> mockServiceContext = MockHelpers.ServiceContext;
        Mock<IServiceProvider> mockServiceProvider = MockHelpers.ServiceProvider;
        Mock<IUserRepository> mockUserRepository = new Mock<IUserRepository>();
        Mock<IAccountEmailService> mockAccountEmailService = new Mock<IAccountEmailService>();
        Mock<ITokenExchangeStrategyFactory> mockTokenExchangeFactory = new Mock<ITokenExchangeStrategyFactory>();

        [Fact]
        public async void TestLogin()
        {
            var user = new User
            {
                Id = "id", Email = "user@email.com", IsActive = true,
                Local = new UserLocal { Password = new BCryptPasswordHasher().HashPassword(null, "1qaz@WSX") }
            };

            var service = SetupAccountService();
            mockUserRepository.Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email || opt.Id == user.Id)))
                .Returns(Task.FromResult(user));

            // unauthorized
            await Assert.ThrowsAsync<NotAuthorizedException>(() => service.Login("user@email.com", "password"));

            var token = await service.Login("user@email.com", "1qaz@WSX");
            Assert.Equal("id", token.Id);
            Assert.Equal("token for user@email.com", token.Token);
        }

        [Fact]
        public async void TestLogin_IUserIdentity()
        {
            var user = new User
            {
                Id = "id",
                Email = "user@email.com",
                IsActive = true,
                Local = new UserLocal { Password = new BCryptPasswordHasher().HashPassword(null, "1qaz@WSX") }
            };

            var service = SetupAccountService();
            mockUserRepository.Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email || opt.Id == user.Id)))
                .Returns(Task.FromResult(user));

            var claimsIdentity = new ClaimsIdentity();
            claimsIdentity.AddClaim(new Claim("email", "user@email.com"));
            var userIdentity = new UserIdentity(claimsIdentity);

            var token = await service.Login(userIdentity);
            Assert.Equal("id", token.Id);
            Assert.Equal("token for user@email.com", token.Token);
        }

        [Fact]
        public async void TestRegister()
        {
            var user = new User
            {
                Email = "user@email.com",
                IsActive = true,
                Local = new UserLocal { Password = new BCryptPasswordHasher().HashPassword(null, "1qaz@WSX") }
            };

            var service = SetupAccountService();
            mockUserRepository
                .Setup(c => c.Add(It.Is<User>(u => u.Email == user.Email)))
                .Returns(() =>
                {
                    user.Id = "newly-inserted-id";
                    return Task.FromResult(user);
                })
                .Verifiable();
            mockUserRepository
                .Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email)))
                .Returns(() =>
                {
                    return Task.FromResult(user.Id == null ? null : user);
                })
                .Verifiable();

            var registeredUser = await service.Register("user@email.com", "firstName", "lastName");

            Assert.Equal("newly-inserted-id", registeredUser.Id);

            mockUserRepository.VerifyAll();
            mockAccountEmailService.Verify(c => c.SendAccountVerificationEmail(It.Is<User>(usr => usr.Email == user.Email)));
        }

        [Fact]
        public async void TestRegister_UserIdentity()
        {
            var user = new User
            {
                Email = "user@email.com",
                IsActive = true,
                Local = new UserLocal { Password = new BCryptPasswordHasher().HashPassword(null, "1qaz@WSX") }
            };

            var service = SetupAccountService();
            mockUserRepository
                .Setup(c => c.Add(It.Is<User>(u => u.Email == user.Email)))
                .Returns(() =>
                {
                    user.Id = "newly-inserted-id";
                    return Task.FromResult(user);
                })
                .Verifiable();
            mockUserRepository
                .Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email)))
                .Returns(() =>
                {
                    return Task.FromResult(user.Id == null ? null : user);
                })
                .Verifiable();


            var claimsIdentity = new ClaimsIdentity(OAuthProvider.Google.GetName());
            claimsIdentity.AddClaim(new Claim("email", "user@email.com"));
            var userIdentity = new UserIdentity(claimsIdentity);

            var registeredUser = await service.Register(userIdentity);

            Assert.Equal(OAuthProvider.Google.GetName(), userIdentity.AuthenticationType);
            Assert.Equal("newly-inserted-id", registeredUser.Id);

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void TestConfirmActivation_UserHasNoPassword()
        {
            var user = new User
            {
                Email = "user@email.com",
                IsActive = false,
                Local = new UserLocal { IsRegistered = true },
                Activation = new UserActivation
                {
                    Hash = "wow-hash",
                    Timestamp = DateTime.UtcNow
                }
            };

            var service = SetupAccountService();
            mockUserRepository
                .Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email)))
                .Returns(Task.FromResult(user))
                .Verifiable();

            // using wrong hash
            await Assert.ThrowsAsync<NotValidException>(() => service.ConfirmActivation("user@email.com", "wow-hashx", "new-password"));
            Assert.Null(user.Local.Password);
            Assert.False(user.IsActive);
            Assert.NotNull(user.Activation.Hash);
            Assert.NotNull(user.Activation.Timestamp);

            // using correct hash
            await service.ConfirmActivation("user@email.com", "wow-hash", "new-password");
            Assert.NotNull(user.Local.Password);
            Assert.True(user.IsActive);
            Assert.Null(user.Activation.Hash);
            Assert.Null(user.Activation.Timestamp);

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void TestConfirmActivation_UserHasPassword()
        {
            var hashedUserPassword = passwordHasher.HashPassword(null, "my-password");
            var user = new User
            {
                Email = "user@email.com",
                IsActive = true,
                Local = new UserLocal { IsRegistered = true, Password = hashedUserPassword },
                Activation = new UserActivation
                {
                    Hash = "wow-hash",
                    Timestamp = DateTime.UtcNow
                }
            };

            var service = SetupAccountService();
            mockUserRepository
                .Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email)))
                .Returns(Task.FromResult(user))
                .Verifiable();

            // using wrong hash
            await Assert.ThrowsAsync<NotValidException>(() => service.ConfirmActivation("user@email.com", "wow-hashx", "new-password"));
            Assert.Equal(hashedUserPassword, user.Local.Password);
            Assert.True(user.IsActive);
            Assert.NotNull(user.Activation.Hash);
            Assert.NotNull(user.Activation.Timestamp);

            // using correct hash
            await service.ConfirmActivation("user@email.com", "wow-hash", "new-password");
            Assert.Equal(PasswordVerificationResult.Success, passwordHasher.VerifyHashedPassword(null, user.Local.Password, "new-password"));
            Assert.True(user.IsActive);
            Assert.Null(user.Activation.Hash);
            Assert.Null(user.Activation.Timestamp);

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void TestChangePassword_HasPassword()
        {
            var hashedUserPassword = passwordHasher.HashPassword(null, "old-password");
            var user = new User
            {
                Email = "user@email.com",
                IsActive = true,
                Local = new UserLocal { IsRegistered = true, Password = hashedUserPassword }
            };

            var service = SetupAccountService();
            mockUserRepository
                .Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email)))
                .Returns(Task.FromResult(user))
                .Verifiable();

            await Assert.ThrowsAsync<NotValidException>(() => service.ChangePassword("user@email.com", "wrong-old-password", "new-password"));
            Assert.Equal(PasswordVerificationResult.Failed, passwordHasher.VerifyHashedPassword(null, user.Local.Password, "new-password"));

            await service.ChangePassword("user@email.com", "old-password", "new-password");
            Assert.Equal(PasswordVerificationResult.Success, passwordHasher.VerifyHashedPassword(null, user.Local.Password, "new-password"));

            mockUserRepository.VerifyAll();
        }


        [Fact]
        public async void TestChangePassword_HasNoPassword()
        {
            var user = new User
            {
                Email = "user@email.com",
                IsActive = true,
                Local = new UserLocal { IsRegistered = true, Password = null }
            };

            var service = SetupAccountService();
            mockUserRepository
                .Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email)))
                .Returns(Task.FromResult(user))
                .Verifiable();
            
            await service.ChangePassword("user@email.com", "old-password", "new-password");
            Assert.Equal(PasswordVerificationResult.Success, passwordHasher.VerifyHashedPassword(null, user.Local.Password, "new-password"));

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void TestRequestPassword()
        {
            var user = new User
            {
                Id = "id",
                Email = "user@email.com",
                IsActive = true,
                Local = new UserLocal { IsRegistered = true, Password = null }
            };

            var service = SetupAccountService();
            mockUserRepository
                .Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email)))
                .Returns(Task.FromResult(user))
                .Verifiable();
            mockUserRepository
                .Setup(c => c.Update(It.Is<User>(u => u.Id == "id" && u.Activation.Hash != null && u.Activation.Timestamp != null)))
                .Returns(Task.FromResult(user))
                .Verifiable();
            mockAccountEmailService
                .Setup(c => c.SendAccountPasswordResetEmail(It.Is<User>(u => u.Id == "id")))
                .Returns(Task.FromResult(0))
                .Verifiable();

            await service.RequestPasswordReset("user@email.com");

            mockUserRepository.VerifyAll();
            mockAccountEmailService.VerifyAll();
            
            await Assert.ThrowsAsync<NotFoundExeption>(() => service.RequestPasswordReset("user@not-email.com"));
        }
        
        [Fact]
        public async void TestRequestPassword_WithActivationAlreadyExists()
        {
            var user = new User
            {
                Id = "id",
                Email = "user@email.com",
                IsActive = true,
                Local = new UserLocal { IsRegistered = true, Password = null },
                Activation = new UserActivation { Hash = "existing-hash", Timestamp = DateTime.UtcNow }
            };

            var service = SetupAccountService();
            mockUserRepository
                .Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email)))
                .Returns(Task.FromResult(user))
                .Verifiable();

            await Assert.ThrowsAsync<NotValidException>(() => service.RequestPasswordReset("user@email.com"));

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void TestRequestUserActivation()
        {
            var user = new User
            {
                Id = "id",
                Email = "user@email.com",
                IsActive = true,
                Local = new UserLocal { IsRegistered = true, Password = null }
            };

            var service = SetupAccountService();
            mockUserRepository
                .Setup(c => c.First(It.Is<UserQueryOptions>(opt => opt.Email == user.Email)))
                .Returns(Task.FromResult(user))
                .Verifiable();
            mockUserRepository
                .Setup(c => c.Update(It.Is<User>(u => u.Id == "id" && u.Activation.Hash != null && u.Activation.Timestamp != null)))
                .Returns(Task.FromResult(user))
                .Verifiable();
            mockAccountEmailService
                .Setup(c => c.SendAccountVerificationEmail(It.Is<User>(u => u.Id == "id")))
                .Returns(Task.FromResult(0))
                .Verifiable();

            await service.RequestUserActivation("user@email.com");

            mockUserRepository.VerifyAll();
            mockAccountEmailService.VerifyAll();
        }

        [Fact]
        public async void CheckUsernameAvailability()
        {
            var users = new List<User>
            {
                new User { Id = "user1", Email = "user1@email.com", IsActive = true, Username = "user1" },
                new User { Id = "user2", Email = "user2@email.com", IsActive = true, Username = "user2" }
            };

            var service = SetupAccountService();
            mockUserRepository
                .Setup(c => c.First(It.IsAny<UserQueryOptions>()))
                .Returns<UserQueryOptions>(opt => Task.FromResult(users.First(u => u.Email == opt.Email)))
                .Verifiable();
            mockUserRepository
                .Setup(c => c.CheckUsernameAvailability(It.IsAny<User>(), It.IsAny<string>()))
                .Returns<User, string>((user, username) =>
                {
                    if (!users.Any(u => u.Email == user.Email && u.Username == username))
                        throw new NotValidException("exists");
                    return Task.FromResult(0);
                })
                .Verifiable();

            // available because it's us
            await service.CheckUsernameAvailability("user1@email.com", "user1");
            await Assert.ThrowsAsync<NotValidException>(() => service.CheckUsernameAvailability("user1@email.com", "user2"));

            mockUserRepository.VerifyAll();
        }

        [Fact]
        public async void GenerateUserToken()
        {
            var user = new User
            {
                Id = "id",
                Email = "user@email.com",
                IsActive = true,
                Local = new UserLocal { IsRegistered = true, Password = null }
            };

            var service = SetupAccountService();
            var token = await service.GenerateUserToken(user);

            Assert.Equal("token for user@email.com", token.Token);
        }

        [Fact]
        public async void Exchange()
        {
            var googleConfig = new GoogleOAuthProviderConfiguration();

            var mockGoogleStrategy = new Mock<ITokenExchangeStrategy>();

            var service = SetupAccountService();
            mockServiceProvider
                .Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IOptions<GoogleOAuthProviderConfiguration>))))
                .Returns(googleConfig)
                .Verifiable();
            mockServiceProvider
                .Setup(c => c.GetService(It.Is<Type>(t => t == typeof(GoogleTokenExchangeStrategy))))
                .Returns(mockGoogleStrategy.Object)
                .Verifiable();
            mockTokenExchangeFactory
                .Setup(c => c.GetStrategy(It.IsAny<IServiceProvider>(), It.Is<OAuthProvider>(str => str == OAuthProvider.Google)))
                .Returns(mockGoogleStrategy.Object)
                .Verifiable();

            await service.Exchange(OAuthProvider.Google, AuthenticationToken.Empty);
            
            mockTokenExchangeFactory.VerifyAll();
        }





        AccountService SetupAccountService()
        {
            errorDescriber = new IdentityErrorDescriber();
            serverConfig = new ServerConfiguration();
            emailConfig = new EmailConfiguration();

            mockServiceProvider = MockHelpers.ServiceProvider;
            mockServiceContext = MockHelpers.ServiceContext;
            mockUserRepository = new Mock<IUserRepository>();
            mockAccountEmailService = new Mock<IAccountEmailService>();
            mockTokenExchangeFactory = new Mock<ITokenExchangeStrategyFactory>();

            mockServiceContext.Setup(c => c.ServiceProvider).Returns(mockServiceProvider.Object);

            var identityOptions = new IdentityOptions
            {
                Tokens = new TokenOptions
                {
                    ChangeEmailTokenProvider = AccountTokenProvider.ProviderKey,
                    EmailConfirmationTokenProvider = AccountTokenProvider.ProviderKey,
                    PasswordResetTokenProvider = AccountTokenProvider.ProviderKey
                }
            };

            var accountStore = new AccountStore(mockUserRepository.Object,
                new OptionsWrapper<ServerConfiguration>(serverConfig),
                new OptionsWrapper<EmailConfiguration>(emailConfig));

            var userManager = new UserManager<User>(accountStore, new OptionsWrapper<IdentityOptions>(identityOptions), passwordHasher, null, null, null, errorDescriber, null, new ConsoleLogger<UserManager<User>>());
            userManager.RegisterTokenProvider("Account", new FakeTokenProvider());


            return new AccountService(mockServiceContext.Object, mockUserRepository.Object, mockAccountEmailService.Object, mockTokenExchangeFactory.Object, userManager);
        }

        class FakeTokenProvider : IUserTwoFactorTokenProvider<User>
        {
            public Task<bool> CanGenerateTwoFactorTokenAsync(UserManager<User> manager, User user)
            {
                return Task.FromResult(true);
            }

            public Task<string> GenerateAsync(string purpose, UserManager<User> manager, User user)
            {
                return Task.FromResult("token for " + user.Email);
            }

            public Task<bool> ValidateAsync(string purpose, string token, UserManager<User> manager, User user)
            {
                return Task.FromResult(token == user.Activation?.Hash);
            }
        }
    }
}
