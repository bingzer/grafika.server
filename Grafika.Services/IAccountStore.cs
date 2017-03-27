using Microsoft.AspNetCore.Identity;

namespace Grafika.Services
{
    public interface IAccountStore :
        IUserStore<User>,
        IUserEmailStore<User>,
        IUserClaimStore<User>,
        IUserPasswordStore<User>
    {
    }
}
