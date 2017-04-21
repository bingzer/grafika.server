using System.Threading.Tasks;
using Grafika.Connections;
using Grafika.Configurations;
using Microsoft.Extensions.Options;
using Grafika.Utilities;

namespace Grafika.Services.Aws
{
    class AwsConnectionHub : ConnectionHub, IAwsConnectionHub
    {
        private readonly IHttpClientFactory _httpFactory;
        private readonly string _pingUrl;

        public AwsConnectionHub(IHttpClientFactory httpFactory, IOptions<AwsOAuthProviderConfiguration> awsOpts) 
            : base("Aws")
        {
            _httpFactory = httpFactory;

            var awsConfig = awsOpts.Value;
            _pingUrl = Utility.CombineUrl(awsConfig.Url, awsConfig.Bucket, awsConfig.PingPath);
        }

        public override async Task CheckStatus()
        {
            using (var client = _httpFactory.CreateHttpClient())
            using (var response = await client.GetAsync(_pingUrl))
            {
                if (!response.IsSuccessStatusCode)
                    throw new NotExpectedException(response.StatusCode.GetName());
            }
        }
    }
}
