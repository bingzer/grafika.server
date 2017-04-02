using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAnimationEmailService : IEmailService
    {
        Task SendAnimationCommentEmail(string animationId, IComment userComment);
    }
}
