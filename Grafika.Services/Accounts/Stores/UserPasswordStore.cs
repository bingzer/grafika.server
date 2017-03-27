using Microsoft.AspNetCore.Identity;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Grafika.Services.Accounts.Stores
{
    partial class AccountStore : IUserPasswordStore<User>
    {
        public Task SetPasswordHashAsync(User user, string passwordHash, CancellationToken cancellationToken)
        {
            user.IsActive = true;
            user.Local = new UserLocal
            {
                IsRegistered = true,
                Password = passwordHash
            };
            user.Activation = new UserActivation();

            return Task.FromResult(0);
        }

        public async Task<string> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
        {
            var userPassword = await FindByEmailAsync(user.Email, cancellationToken);
            return userPassword?.Local?.Password;
        }

        public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user?.Local?.Password != null);
        }
    }
}
