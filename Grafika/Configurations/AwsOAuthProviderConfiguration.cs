namespace Grafika.Configurations
{
    public class AwsOAuthProviderConfiguration : OAuthProviderConfiguration
    {
        public string Bucket { get; set; }
        public string Folder { get; set; }
        public string PingPath { get; set; }
    }
}
