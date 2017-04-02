using Grafika.Animations;
using System.IO;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IAwsRepository : IRepository
    {

    }

    public interface IAwsFrameRepository : IAwsRepository
    {
        Task PostFrameData(Animation animation, FrameData frameData);
        //Task<FrameData> CreateFirstFrameData(Animation animation);
        Task<FrameData> GetFrameData(Animation animation, FrameData frameData);
    }

    public interface IAwsResourceRepository : IAwsRepository
    {
        Task<ISignedUrl> CreateSignedUrl(Animation animation, string resourceId, string contentType);
        Task<string> GetResourceUrl(string animationId, string resourceId);
        Task<bool> HasResource(string animationId, string resourceId);
    }

    public interface IAwsUsersRepository : IAwsRepository
    {
        Task<ISignedUrl> CreateSignedUrl(IUser user, string imageType, string contentType);
    }
}
