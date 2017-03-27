using Amazon.S3.Model;
using ComponentAce.Compression.Libs.zlib;
using Grafika.Animations;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Grafika.Utilities;

namespace Grafika.Services.Aws
{
    internal class FrameDataDeflatedProcessingStrategy : IFrameDataProcessingStrategy
    {
        public bool AcceptEncoding(string contentEncoding)
        {
            return !"deflate".EqualsIgnoreCase(contentEncoding);
        }

        public async Task<FrameData> ProcessHttpGet(FrameData frameData, string requestUrl)
        {
            var handler = new HttpClientHandler();
            handler.AutomaticDecompression = System.Net.DecompressionMethods.None;
            using (var httpClient = new HttpClient(handler))
            {
                var memoryStream = new MemoryStream();
                var zoutput = new ZOutputStream(memoryStream);
                var instream = await httpClient.GetStreamAsync(requestUrl);

                instream.CopyTo(zoutput);
                zoutput.finish();

                memoryStream.Position = 0;
                frameData.Stream = memoryStream;
            }

            return frameData;
        }

        public async Task ProcessHttpPost(FrameData frameData, PutObjectRequest putObjectRequest)
        {
            var memoryStream = new MemoryStream();
            var zoutputStream = new ZOutputStream(memoryStream, zlibConst.Z_DEFAULT_COMPRESSION);

            await frameData.Stream.CopyToAsync(zoutputStream);
            zoutputStream.finish();

            putObjectRequest.InputStream = memoryStream;
            putObjectRequest.Headers.ContentLength = memoryStream.Length;
        }
    }
}
