namespace Grafika.Configurations
{
    public class OAuthProviderConfiguration
    {
        public string Id { get; set; }
        public string Secret { get; set; }
        public string Scopes { get; set; }
        public string Url { get; set; }
        public string CallbackPath { get; set; }
        public string IdTokenUrl { get; set; }
    }
}
