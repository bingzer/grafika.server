using Amazon.S3;
using Grafika.Configurations;
using Grafika.Services.Aws;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Aws
{
    public class AwsRepositoryTest
    {
        [Fact]
        public void TestCotr()
        {
            var mockS3 = new Mock<IAmazonS3>();
            var mockAwsOpts = new Mock<IOptions<AwsOAuthProviderConfiguration>>();

            var repo = new TestingAwsRepository(mockAwsOpts.Object, mockS3.Object);
            Assert.NotNull(repo.TheClient);
        }


    }

    class TestingAwsRepository : AwsRepository
    {
        public IAmazonS3 TheClient => Client;

        public TestingAwsRepository(IOptions<AwsOAuthProviderConfiguration> serverOpts, IAmazonS3 client = null) 
            : base(serverOpts, client)
        {
        }
    }
}
