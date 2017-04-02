using System;
using System.Threading.Tasks;

namespace Grafika.Services.Accounts.Tokens
{
    public interface ITokenExchangeStrategy : IDisposable
    {
        Task<IUserIdentity> ExchangeToken(string idToken);
    }
}
