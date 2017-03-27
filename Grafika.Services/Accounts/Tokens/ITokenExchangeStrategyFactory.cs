using System;

namespace Grafika.Services.Accounts.Tokens
{
    public interface ITokenExchangeStrategyFactory
    {
        ITokenExchangeStrategy GetStrategy(IServiceProvider serviceProvider, OAuthProvider authProvider);
    }
}
