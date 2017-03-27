using Grafika.Utilities;
using System;

namespace Grafika.Services.Accounts.Tokens
{
    internal class TokenExchangeStrategyFactory : ITokenExchangeStrategyFactory
    {
        public ITokenExchangeStrategy GetStrategy(IServiceProvider serviceProvider, OAuthProvider authProvider)
        {
            ITokenExchangeStrategy strategy;
            switch (authProvider)
            {
                case OAuthProvider.Google:
                    strategy = serviceProvider.Get<GoogleTokenExchangeStrategy>();
                    break;
                case OAuthProvider.Facebook:
                    strategy = serviceProvider.Get<FacebookTokenExchangeStrategy>();
                    break;
                default: throw new NotImplementedException("provider : " + authProvider);
            }

            return strategy;
        }
    }
}
