using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;

namespace Grafika.Services.Accounts.Stores
{
    partial class AccountStore : IUserEmailStore<User>
    {
        public Task<User> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken) => FindByEmail(normalizedEmail);

        public Task<string> GetEmailAsync(User user, CancellationToken cancellationToken) => Task.FromResult(user.Email);
        public Task<bool> GetEmailConfirmedAsync(User user, CancellationToken cancellationToken) => Task.FromResult(user.Email != null && user.IsActive.Value);
        public Task<string> GetNormalizedEmailAsync(User user, CancellationToken cancellationToken) => Task.FromResult(user.Email?.ToLowerInvariant());
        public Task SetNormalizedEmailAsync(User user, string normalizedEmail, CancellationToken cancellationToken) => Task.Run(() => user.Email = normalizedEmail);
        public Task SetEmailAsync(User user, string email, CancellationToken cancellationToken) => Task.Run(() => user.Email = email);

        public async Task SetEmailConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
        {
            if (confirmed)
            {
                var update = new User(user.Id) { Email = user.Email, IsActive = confirmed, Activation = new UserActivation() };
                await UpdatePartial(update);
            }
        }
    }
}
