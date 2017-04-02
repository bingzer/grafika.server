using Amazon.S3;
using Grafika.Configurations;
using Microsoft.Extensions.Options;
using System;

namespace Grafika.Services.Aws
{
    internal abstract class AwsRepository : IAwsRepository
    {
        protected internal static DateTime DefaultExpiration { get { return DateTime.UtcNow.AddHours(1); } }

        protected readonly AwsOAuthProviderConfiguration Config;
        protected readonly IAmazonS3 Client;

        public AwsRepository(IOptions<AwsOAuthProviderConfiguration> serverOpts, IAmazonS3 client = null)
        {
            Config = serverOpts.Value;
            Client = client;

            if (Client == null)
                Client = new AmazonS3Client(Config.Id, Config.Secret, Amazon.RegionEndpoint.USEast1);
        }

        public virtual void Dispose()
        {
            // nothing
        }
    }
}
