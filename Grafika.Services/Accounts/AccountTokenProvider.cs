using Grafika.Configurations;
using Grafika.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Grafika.Services.Accounts
{
    public class AccountTokenProvider : IUserTwoFactorTokenProvider<User>
    {
        public static TokenProviderDescriptor ProviderDescriptor => new TokenProviderDescriptor(typeof(AccountTokenProvider));
        public const string ProviderKey = "Account";
        public const string PurposeAuthentication = "Authentication";
        public const string PurposeEmailConfirmation = "EmailConfirmation";
        public const string PurposeResetPassword = "ResetPassword";

        public SecurityKey SecurityKey { get; private set; }
        public JwtSecurityTokenHandler TokenHandler { get; private set; }
        public TokenValidationParameters ValidationParameters => new TokenValidationParameters
        {
            IssuerSigningKey = SecurityKey,
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateLifetime = false,
            AuthenticationType = "Bearer"
        };

        private readonly IUserValidator _userValidator;
        private readonly JwtConfiguration _jwtConfigs;
        private readonly SigningCredentials _credentials;

        public AccountTokenProvider(IUserValidator userValidator, IOptions<JwtConfiguration> jwtOptions, IOptions<ServerConfiguration> serverOptions)
        {
            _userValidator = userValidator;
            _jwtConfigs = jwtOptions.Value;

            SecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(serverOptions.Value.Secret));
            _credentials = new SigningCredentials(SecurityKey, SecurityAlgorithms.HmacSha256);

            TokenHandler = new AccountTokenHandler();
        }

        public Task<bool> CanGenerateTwoFactorTokenAsync(UserManager<User> manager, User user)
        {
            return Task.FromResult(true);
        }

        /// <summary>
        /// This method is called by UserManager.GenerateUserTokenAsync()
        /// This method will generate JWT token
        /// </summary>
        /// <param name="purpose"></param>
        /// <param name="manager"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<string> GenerateAsync(string purpose, UserManager<User> manager, User user)
        {
            switch (purpose)
            {
                case PurposeEmailConfirmation:
                case PurposeResetPassword:
                    return BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString(), 8);
                case PurposeAuthentication:
                    return await GenerateAuthenticationTokenAsync(manager, user);
                default:
                    throw new NotSupportedException("purpose: " + purpose);
            }
        }

        public async Task<bool> ValidateAsync(string purpose, string token, UserManager<User> manager, User user)
        {
            switch (purpose)
            {
                case PurposeEmailConfirmation:
                case PurposeResetPassword:
                    var fromSystem = await manager.FindByEmailAsync(user.Email);
                    return fromSystem.Activation.IsActivationValid(token, TimeSpan.FromHours(1));
                default: throw new NotSupportedException("purpose: " + purpose);
            }
        }

        private async Task<string> GenerateAuthenticationTokenAsync(UserManager<User> manager, User user)
        {
            _userValidator.Sanitize(user, user);

            var claims = await manager.GetClaimsAsync(user);

            // Create the JWT and write it to a string
            var now = DateTimeOffset.UtcNow;
            var iat = now.ToUnixTimeSeconds().ToString();
            var expires = now.Add(_jwtConfigs.ExpirationLength).ToUnixTimeSeconds().ToString();

            var jwtHeader = new JwtHeader(_credentials);
            var jwtPayload = JwtPayload.Deserialize(user.ToJson());
            jwtPayload.AddClaim(new Claim(JwtRegisteredClaimNames.Iss, _jwtConfigs.Issuer));
            jwtPayload.AddClaim(new Claim(JwtRegisteredClaimNames.Aud, _jwtConfigs.Audience));
            jwtPayload.AddClaim(new Claim(JwtRegisteredClaimNames.Iat, iat, ClaimValueTypes.Integer32));
            jwtPayload.AddClaim(new Claim(JwtRegisteredClaimNames.Exp, expires, ClaimValueTypes.Integer32));
            jwtPayload.AddClaims(claims);

            var jwt = new JwtSecurityToken(jwtHeader, jwtPayload);
            var encodedJwt = TokenHandler.WriteToken(jwt);

            return encodedJwt;
        }
    }
}
