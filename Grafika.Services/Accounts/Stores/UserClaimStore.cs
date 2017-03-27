using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Grafika.Services.Accounts.Stores
{
    partial class AccountStore : IUserClaimStore<User>
    {
        public Task<IList<Claim>> GetClaimsAsync(User user, CancellationToken cancellationToken)
        {
            IList<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Sid, user.Id),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Email)
            };

            user.Roles.ToList().ForEach(role => claims.Add(new Claim(ClaimTypes.Role, role)));

            return Task.FromResult(claims);
        }

        public Task AddClaimsAsync(User user, IEnumerable<Claim> claims, CancellationToken cancellationToken) => throw new NotImplementedException();
        public Task ReplaceClaimAsync(User user, Claim claim, Claim newClaim, CancellationToken cancellationToken) => throw new NotImplementedException();
        public Task RemoveClaimsAsync(User user, IEnumerable<Claim> claims, CancellationToken cancellationToken) => throw new NotImplementedException();
        public Task<IList<User>> GetUsersForClaimAsync(Claim claim, CancellationToken cancellationToken) => throw new NotImplementedException();
    }
}
