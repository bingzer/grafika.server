using Grafika.Animations;
using Grafika.Services.Comments;
using System;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface ICommentService : IService
    {
        Task<AuthenticationToken> GenerateAuthenticationToken(IUser user);
        Task<Uri> GenerateRemoteUrl(ICommentAuthenticationContext context);
        Task<Uri> GenerateRemoteUrl(Animation animation, User user);
    }
}
