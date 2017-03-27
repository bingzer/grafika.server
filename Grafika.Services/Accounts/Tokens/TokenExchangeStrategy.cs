using Grafika.Configurations;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Grafika.Services.Accounts.Tokens
{
    abstract class TokenExchangeStrategy<TConfig> : ITokenExchangeStrategy
        where TConfig : OAuthProviderConfiguration, new()
    {
        private readonly HttpClient _backChannel;
        private readonly Uri _idTokenUrl;

        public abstract string AuthenticationType { get; }

        public TokenExchangeStrategy(IOptions<TConfig> opts)
        {
            _backChannel = new HttpClient();
            _idTokenUrl = new Uri(opts.Value.IdTokenUrl);
        }

        public virtual async Task<IUserIdentity> ExchangeToken(string idToken)
        {
            var tokenRedemptionUrl = BuildIdTokenRedemptionUrl(_idTokenUrl, idToken);

            var request = CreateHttpRequestMessage(tokenRedemptionUrl);
            var response = await _backChannel.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                throw new NotValidException("Unable to verify the id token provided. " + response.StatusCode);

            var payload = JObject.Parse(await response.Content.ReadAsStringAsync()).ToObject<JwtPayload>();
            var userIdentity = CreateUserIdentityFromPayload(payload);

            return userIdentity;
        }
        
        protected abstract Uri BuildIdTokenRedemptionUrl(Uri tokenUrl, string idToken);

        protected virtual IUserIdentity CreateUserIdentityFromPayload(JwtPayload payload)
        {
            var claimsIdentity = new ClaimsIdentity(AuthenticationType);
            claimsIdentity.AddClaims(payload.Claims);

            return new UserIdentity(claimsIdentity);
        }

        protected virtual HttpRequestMessage CreateHttpRequestMessage(Uri tokenRedemptionUrl)
        {
            return new HttpRequestMessage(HttpMethod.Get, tokenRedemptionUrl);
        }

        public void Dispose()
        {
            _backChannel.Dispose();
        }
    }
}
