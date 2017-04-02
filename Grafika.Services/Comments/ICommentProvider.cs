using System;
using System.Threading.Tasks;

namespace Grafika.Services.Comments
{
    interface ICommentProvider
    {
        Task<AuthenticationToken> GenerateAuthenticationToken(IUser user);
        Task<Uri> GetCommentUrl(ICommentAuthenticationContext context);
    }
}
