using System;
using System.Threading.Tasks;
using Grafika.Configurations;
using Microsoft.Extensions.Options;
using Amazon.S3.Model;
using Grafika.Utilities;
using Amazon.S3;

namespace Grafika.Services.Aws
{
    class AwsUsersRepository : AwsRepository, IAwsUsersRepository
    {
        public AwsUsersRepository(IOptions<AwsOAuthProviderConfiguration> serverOpts, IAmazonS3 client = null) 
            : base(serverOpts, client)
        {
        }

        public Task<ISignedUrl> CreateSignedUrl(IUser user, string imageType, string contentType)
        {
            switch (imageType)
            {
                case "avatar":
                case "backdrop":
                    break;
                default:
                    throw new NotSupportedException("imageType = " + imageType);
            }

            var signedUrlRequest = new GetPreSignedUrlRequest
            {
                BucketName = Config.Bucket,
                Key = Utility.CombineUrl(Config.Folder, "users", user.Id, imageType),
                Expires = DefaultExpiration,
                ContentType = contentType,
                Verb = Amazon.S3.HttpVerb.PUT
            };
            signedUrlRequest.Headers["x-amz-acl"] = S3CannedACL.PublicRead.Value;

            var url = new SignedUrl
            {
                Url = Client.GetPreSignedURL(signedUrlRequest),
                ContentType = contentType
            };

            return Task.FromResult<ISignedUrl>(url);
        }
    }
}
