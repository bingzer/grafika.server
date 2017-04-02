using Amazon.S3;
using Amazon.S3.Model;
using Grafika.Animations;
using Grafika.Configurations;
using Grafika.Services.Aws;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services.Aws
{
    public class AwsFrameRepositoryTest
    {
        [Theory]
        [InlineData("animationId1", "deflate")]
        [InlineData("animationId77", "")]
        [InlineData("animationId5", null)]
        public async void TestGetFrameData(string animationId, string contentEncoding)
        {
            var frameData = new FrameData { ContentEncoding = contentEncoding };
            FrameData afterProcessed = null;

            var awsOpts = MockHelpers.Configure<AwsOAuthProviderConfiguration>();
            awsOpts.Object.Value.Bucket = "bucket";
            awsOpts.Object.Value.Folder = "folder";
            var mockStrategy = new Mock<IFrameDataProcessingStrategy>();
            mockStrategy.Setup(c => c.ProcessHttpGet(It.IsAny<FrameData>(), It.IsAny<string>()))
                .Callback<FrameData, string>((fd, url) => afterProcessed = fd)
                .ReturnsAsync(() => afterProcessed );
            var mockFactory = new Mock<IFrameDataProcessingFactory>();
            mockFactory.Setup(c => c.GetProcessor(It.Is<string>(str => str == contentEncoding)))
                .Returns(mockStrategy.Object);
            
            var mockClient = new Mock<IAmazonS3>();
            mockClient.Setup(c => c.GetPreSignedURL(It.Is<GetPreSignedUrlRequest>(
                    req => req.BucketName == "bucket" &&
                        req.Key == $"folder/animations/{animationId}/frames"
                )))
                .Returns(() => "signed-url")
                .Verifiable();

            var repo = new AwsFrameRepository(mockFactory.Object, awsOpts.Object, mockClient.Object);
            frameData = await repo.GetFrameData(new Animation { Id = animationId }, frameData);

            Assert.Equal(frameData.ContentType, ContentTypes.Json);  // always JSOn

            mockStrategy.VerifyAll();
            mockFactory.VerifyAll();
            mockClient.VerifyAll();
        }

        [Theory]
        [InlineData("animationId1", "deflate")]
        [InlineData("abcd1234", "")]
        [InlineData("QAZ2wsx", null)]
        public async void TestPostFrameData(string animationId, string contentEncoding)
        {
            var frameData = new FrameData { ContentEncoding = contentEncoding, ContentType = ContentTypes.Json };
            PutObjectRequest putRequest = new PutObjectRequest();

            var awsOpts = MockHelpers.Configure<AwsOAuthProviderConfiguration>();
            awsOpts.Object.Value.Bucket = "bucket";
            awsOpts.Object.Value.Folder = "folder";
            var mockStrategy = new Mock<IFrameDataProcessingStrategy>();
            mockStrategy.Setup(c => c.ProcessHttpPost(It.IsAny<FrameData>(), It.Is<PutObjectRequest>(
                    req => req.BucketName == "bucket" &&
                            req.Key == $"folder/animations/{animationId}/frames" &&
                            req.ContentType == frameData.ContentType &&
                            req.CannedACL == S3CannedACL.AuthenticatedRead
                )))
                .Callback<FrameData, PutObjectRequest>((fd, req) => putRequest = req)
                .Returns(Task.FromResult(0));
            var mockFactory = new Mock<IFrameDataProcessingFactory>();
            mockFactory.Setup(c => c.GetProcessor(It.Is<string>(str => str == contentEncoding)))
                .Returns(mockStrategy.Object);

            var mockClient = new Mock<IAmazonS3>();
            mockClient.Setup(c => c.PutObjectAsync(It.IsAny<PutObjectRequest>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new PutObjectResponse());

            var repo = new AwsFrameRepository(mockFactory.Object, awsOpts.Object, mockClient.Object);
            await repo.PostFrameData(new Animation { Id = animationId }, frameData);

            mockStrategy.VerifyAll();
            mockClient.VerifyAll();
            mockFactory.VerifyAll();
        }
    }
}
