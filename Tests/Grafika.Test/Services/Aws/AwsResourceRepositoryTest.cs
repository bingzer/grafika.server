using Amazon.S3;
using Amazon.S3.Model;
using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Services.Aws;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Aws
{
    public class AwsResourceRepositoryTest
    {
        [Theory]
        [InlineData("animationId1", "resourceId1", ContentTypes.Png)]
        [InlineData("animationId6", "resourceId2", ContentTypes.Json)]
        [InlineData("animationId5", "resourceId3", ContentTypes.Xml)]
        public async void TestCreateSignedUrl(string animationId, string resourceId, string contentType)
        {
            var resource = new TestingResource { Id = resourceId };

            var awsOpts = MockHelpers.Configure<AwsOAuthProviderConfiguration>();
            awsOpts.Object.Value.Bucket = "bucket";
            awsOpts.Object.Value.Folder = "folder";

            var mockClient = new Mock<IAmazonS3>();
            mockClient.Setup(c => c.GetPreSignedURL(It.Is<GetPreSignedUrlRequest>(
                    req => req.BucketName == "bucket" &&
                        req.Key == $"folder/animations/{animationId}/{resourceId}" &&
                        req.Verb == HttpVerb.PUT &&
                        req.ContentType == contentType &&
                        req.Headers["x-amz-acl"] == S3CannedACL.PublicRead.Value
                )))
                .Returns(() => "signed-url")
                .Verifiable();

            var repo = new AwsResourceRepository(awsOpts.Object, mockClient.Object);
            var signedUrl = await repo.CreateSignedUrl(new Animation { Id = animationId }, resource, contentType);

            Assert.Equal(signedUrl.Url, "signed-url");
            Assert.Equal(signedUrl.ContentType, contentType);

            mockClient.VerifyAll();

        }

        [Theory]
        [InlineData("animId1", "thumbnail")]
        [InlineData("animId4", "resource1")]
        [InlineData("animId3", "resource2")]
        public async void TestGetResourceUrl(string animationId, string resourceId)
        {
            var awsOpts = MockHelpers.Configure<AwsOAuthProviderConfiguration>();
            awsOpts.Object.Value.Bucket = "bucket";
            awsOpts.Object.Value.Folder = "folder";
            awsOpts.Object.Value.Url = "http://example.com";
            var mockClient = new Mock<IAmazonS3>();

            var repo = new AwsResourceRepository(awsOpts.Object, mockClient.Object);
            var result = await repo.GetResourceUrl(animationId, resourceId);

            Assert.Equal(result, $"http://example.com/bucket/folder/animations/{animationId}/{resourceId}");
        }
    }

    class TestingResource : IResource
    {
        public string Id { get; set; }
    }
}
