using Amazon.S3.Model;
using Grafika.Animations;
using System.Threading.Tasks;

namespace Grafika.Services.Aws
{
    public interface IFrameDataProcessingStrategy
    {
        bool AcceptEncoding(string contentEncoding);

        Task<FrameData> ProcessHttpGet(FrameData frameData, string requestUrl);

        Task ProcessHttpPost(FrameData frameData, PutObjectRequest putObjectRequest);
    }
}
