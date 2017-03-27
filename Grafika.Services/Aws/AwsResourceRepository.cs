using System;
using System.Threading.Tasks;
using Grafika.Animations;
using Grafika.Configurations;
using Microsoft.Extensions.Options;
using Grafika.Utilities;
using Amazon.S3.Model;
using Amazon.S3;

namespace Grafika.Services.Aws
{
    internal class AwsResourceRepository : AwsRepository, IAwsResourceRepository
    {
        public AwsResourceRepository(IOptions<AwsOAuthProviderConfiguration> serverOpts, IAmazonS3 client = null)
            : base(serverOpts, client)
        {
        }

        public Task<ISignedUrl> CreateSignedUrl(Animation animation, IResource resource, string contentType)
        {
            var signedUrlRequest = new GetPreSignedUrlRequest
            {
                BucketName = Config.Bucket,
                Key = Utility.CombineUrl(Config.Folder, "animations", animation.Id, resource.Id),
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


        public Task<string> GetResourceUrl(string animationId, string resourceId)
        {
            var url = Utility.CombineUrl(Config.Url, Config.Bucket, Config.Folder, "animations", animationId, resourceId);
            return Task.FromResult(url);
        }
    }
}
