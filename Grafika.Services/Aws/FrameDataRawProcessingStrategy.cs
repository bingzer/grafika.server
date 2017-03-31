using Amazon.S3.Model;
using Grafika.Animations;
using System.Net.Http;
using System.Threading.Tasks;
using Grafika.Utilities;

namespace Grafika.Services.Aws
{
    internal class FrameDataRawProcessingStrategy : IFrameDataProcessingStrategy
    {
        private readonly IHttpClientFactory _factory;

        public FrameDataRawProcessingStrategy(IHttpClientFactory factory)
        {
            _factory = factory;
        }

        public bool AcceptEncoding(string contentEncoding)
        {
            return "deflate".EqualsIgnoreCase(contentEncoding);
        }

        public async Task<FrameData> ProcessHttpGet(FrameData frameData, string requestUrl)
        {
            var handler = new HttpClientHandler { AutomaticDecompression = System.Net.DecompressionMethods.None };
            using (var httpClient = _factory.CreateHttpClient(handler))
            {
                frameData.ContentEncoding = "deflate";
                frameData.Stream = await httpClient.GetStreamAsync(requestUrl);
            }

            return frameData;
        }

        public Task ProcessHttpPost(FrameData frameData, PutObjectRequest putObjectRequest)
        {
            putObjectRequest.InputStream = frameData.Stream;
            putObjectRequest.Headers.ContentLength = frameData.ContentLength.Value;

            return Task.FromResult(0);
        }
    }
}
