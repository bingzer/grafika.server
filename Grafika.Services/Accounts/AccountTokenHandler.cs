using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace Grafika.Services
{
    class AccountTokenHandler : JwtSecurityTokenHandler
    {
        protected override ClaimsIdentity CreateClaimsIdentity(JwtSecurityToken jwt, string issuer, TokenValidationParameters validationParameters)
        {
            var identity = base.CreateClaimsIdentity(jwt, issuer, validationParameters);
            return new UserIdentity(identity);
        }
    }
}
