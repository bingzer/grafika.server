using Grafika.Animations;
using System.IO;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAwsRepository : IRepository
    {

    }

    public interface IAwsAnimationRepository : IAwsRepository
    {
        Task PostFrameData(Animation animation, FrameData frameData);
        Task<FrameData> GetFrameData(Animation animation, FrameData frameData);
    }

    public interface IAwsBackgroundRepository : IAwsRepository
    {
        Task PostFrameData(Background background, FrameData frameData);
        Task<FrameData> GetFrameData(Background background, FrameData frameData);
    }

    public interface IAwsResourceRepository : IAwsRepository
    {
        Task<ISignedUrl> CreateSignedUrl(Animation animation, string resourceId, string contentType);
        Task<string> GetResourceUrl(string animationId, string resourceId);
        Task<bool> HasResource(string animationId, string resourceId);
        Task<bool> DeleteResource(string animationId, string resourceId);
    }

    public interface IAwsUsersRepository : IAwsRepository
    {
        Task<ISignedUrl> CreateSignedUrl(IUser user, string imageType, string contentType);
    }
}
