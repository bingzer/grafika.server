using System;
using System.Threading.Tasks;
using Grafika.Animations;
using Grafika.Configurations;
using Microsoft.Extensions.Options;
using Grafika.Utilities;
using Amazon.S3.Model;
using Amazon.S3;
using System.Net.Http;

namespace Grafika.Services.Aws
{
    internal class AwsResourceRepository : AwsRepository, IAwsResourceRepository
    {
        private readonly IHttpClientFactory _httpFactory;

        public AwsResourceRepository(IOptions<AwsOAuthProviderConfiguration> serverOpts, IHttpClientFactory httpFactory, IAmazonS3 client = null)
            : base(serverOpts, client)
        {
            _httpFactory = httpFactory;
        }

        public Task<ISignedUrl> CreateSignedUrl(Animation animation, string resourceId, string contentType)
        {
            var signedUrlRequest = new GetPreSignedUrlRequest
            {
                BucketName = Config.Bucket,
                Key = Utility.CombineUrl(Config.Folder, "animations", animation.Id, resourceId),
                Expires = DefaultExpiration,
                Verb = Amazon.S3.HttpVerb.PUT,
                ContentType = contentType
            };
            signedUrlRequest.Headers["x-amz-acl"] = S3CannedACL.PublicRead.Value;

            var signedUrl = new SignedUrl
            {
                Url = Client.GetPreSignedURL(signedUrlRequest), // + $"&Content-Type={contentType}&x-amz",
                ContentType = contentType
            };

            return Task.FromResult<ISignedUrl>(signedUrl);
        }

        public async Task<bool> HasResource(string animationId, string resourceId)
        {
            var resourceUrl = await GetResourceUrl(animationId, resourceId);
            using (var httpClient = _httpFactory.CreateHttpClient())
            {
                var requestMessage = new HttpRequestMessage(HttpMethod.Head, resourceUrl);
                var response = await httpClient.SendAsync(requestMessage);
                return response.IsSuccessStatusCode;
            }
        }

        public Task<string> GetResourceUrl(string animationId, string resourceId)
        {
            var url = Utility.CombineUrl(Config.Url, Config.Bucket, Config.Folder, "animations", animationId, resourceId);
            return Task.FromResult(url);
        }

        public async Task<bool> DeleteResource(string animationId, string resourceId)
        {
            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = Config.Bucket,
                Key = Utility.CombineUrl(Config.Folder, "animations", animationId, resourceId)
            };

            var response = await Client.DeleteObjectAsync(deleteRequest);
            return true;
        }
    }
}
