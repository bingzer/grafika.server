using System;
using Microsoft.Extensions.Options;
using Grafika.Configurations;
using Grafika.Utilities;

namespace Grafika.Services.Accounts.Tokens
{
    class GoogleTokenExchangeStrategy : TokenExchangeStrategy<GoogleOAuthProviderConfiguration>
    {
        public override string AuthenticationType => OAuthProvider.Google.GetName();

        public GoogleTokenExchangeStrategy(IOptions<GoogleOAuthProviderConfiguration> opts, IHttpClientFactory factory)
            : base(opts, factory)
        {
        }

        protected override Uri BuildIdTokenRedemptionUrl(Uri tokenUrl, string idToken)
        {
            var builder = new UriBuilder(tokenUrl);
            builder.Query = "id_token=" + idToken;
            return builder.Uri;
        }
    }
}
