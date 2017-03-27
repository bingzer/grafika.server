using Grafika.Configurations;
using System;
using Microsoft.Extensions.Options;
using Grafika.Utilities;

namespace Grafika.Services.Accounts.Tokens
{
    class FacebookTokenExchangeStrategy : TokenExchangeStrategy<FacebookOAuthProviderConfiguration>
    {
        public override string AuthenticationType => OAuthProvider.Facebook.GetName();

        public FacebookTokenExchangeStrategy(IOptions<FacebookOAuthProviderConfiguration> opts) : base(opts)
        {
        }

        protected override Uri BuildIdTokenRedemptionUrl(Uri tokenUrl, string idToken)
        {
            var builder = new UriBuilder(tokenUrl)
            {
                Query = "fields=id,name,last_name,first_name,middle_name,link,email,picture&access_token=" + idToken
            };
            return builder.Uri;
        }
    }
}
