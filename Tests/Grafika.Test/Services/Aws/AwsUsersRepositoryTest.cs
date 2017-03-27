using Amazon.S3;
using Amazon.S3.Model;
using Grafika.Configurations;
using Grafika.Services.Aws;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Aws
{
    public class AwsUsersRepositoryTest
    {
        [Theory]
        [InlineData("userId", "avatar", ContentTypes.Jpg)]
        [InlineData("userId", "backdrop", ContentTypes.Jpg)]
        public async void TestCreateSignedUrl(string userId, string imageType, string contentType)
        {
            var user = new User { Id = userId };

            var awsOpts = MockHelpers.Configure<AwsOAuthProviderConfiguration>();
            awsOpts.Object.Value.Bucket = "bucket";
            awsOpts.Object.Value.Folder = "folder";

            var mockClient = new Mock<IAmazonS3>();
            mockClient.Setup(c => c.GetPreSignedURL(It.Is<GetPreSignedUrlRequest>(
                    req => req.BucketName == "bucket" &&
                        req.Key == $"folder/users/{userId}/{imageType}" &&
                        req.Verb == HttpVerb.PUT &&
                        req.ContentType == contentType &&
                        req.Headers["x-amz-acl"] == S3CannedACL.PublicRead.Value
                )))
                .Returns(() => "signed-url")
                .Verifiable();

            var repo = new AwsUsersRepository(awsOpts.Object, mockClient.Object);
            var signedUrl = await repo.CreateSignedUrl(user, imageType, contentType);

            Assert.Equal(signedUrl.Url, "signed-url");
            Assert.Equal(signedUrl.ContentType, contentType);

            mockClient.VerifyAll();
        }

        [Theory]
        [InlineData("userId", "other", ContentTypes.Jpg)]
        [InlineData("userId", "mypicture", ContentTypes.Jpg)]
        public async void TestCreateSignedUrl_NotSupported(string userId, string imageType, string contentType)
        {
            var user = new User { Id = userId };

            var awsOpts = MockHelpers.Configure<AwsOAuthProviderConfiguration>();
            awsOpts.Object.Value.Bucket = "bucket";
            awsOpts.Object.Value.Folder = "folder";

            var mockClient = new Mock<IAmazonS3>();

            var repo = new AwsUsersRepository(awsOpts.Object, mockClient.Object);
            await Assert.ThrowsAsync<NotSupportedException>(() => repo.CreateSignedUrl(user, imageType, contentType));

            mockClient.VerifyAll();
        }
    }
}
