using Amazon.S3;
using Amazon.S3.Model;
using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Utilities;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Grafika.Services.Aws
{
    class AwsBackgroundRepository : AwsRepository, IAwsBackgroundRepository
    {
        private readonly IFrameDataProcessingFactory _factory;

        public AwsBackgroundRepository(IFrameDataProcessingFactory factory,
            IOptions<AwsOAuthProviderConfiguration> serverOpts,
            IAmazonS3 client = null) 
            : base(serverOpts, client)
        {
            _factory = factory;
        }

        public async Task<FrameData> GetFrameData(Background background, FrameData frameData)
        {
            var signedUrlRequest = new GetPreSignedUrlRequest
            {
                BucketName = Config.Bucket,
                Expires = DefaultExpiration,
                Key = Utility.CombineUrl(Config.Folder, "backgrounds", background.Id, "frames")
            };

            var signedUrl = Client.GetPreSignedURL(signedUrlRequest);
            frameData = new FrameData(frameData) { ContentType = ContentTypes.Json };

            var processor = _factory.GetProcessor(frameData.ContentEncoding);
            return await processor.ProcessHttpGet(frameData, signedUrl);
        }

        public async Task PostFrameData(Background background, FrameData frameData)
        {
            var putObjectRequest = new PutObjectRequest
            {
                BucketName = Config.Bucket,
                Key = $"{Config.Folder}/backgrounds/{background.Id}/frames",
                ContentType = frameData.ContentType,
                CannedACL = S3CannedACL.AuthenticatedRead
            };
            putObjectRequest.Headers.ContentEncoding = "deflate";

            var processor = _factory.GetProcessor(frameData.ContentEncoding);
            await processor.ProcessHttpPost(frameData, putObjectRequest);

            var response = await Client.PutObjectAsync(putObjectRequest);
            // TODO: maybe throw exception when http status code is not 200ish
        }
    }
}
