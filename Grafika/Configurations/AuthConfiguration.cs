namespace Grafika.Configurations
{
    public class AuthConfiguration
    {
        public AwsOAuthProviderConfiguration Aws { get; set; }
        public GoogleOAuthProviderConfiguration Google { get; set; }
        public FacebookOAuthProviderConfiguration Facebook { get; set; }
        public DisqusOAuthProviderConfiguration Disqus { get; set; }
        public JwtConfiguration Jwt { get; set; }
    }
}
