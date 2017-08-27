using Grafika.Animations;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IFrameService : IService
    {
        Task<FrameData> GetFrameData(string animationId, FrameData frameData);
        Task PostFrameData(string animationId, FrameData frameData);
    }
}
