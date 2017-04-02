namespace Grafika.Configurations
{
    public class ServerInfo
    {
        public string AppName { get; set; }
        public string AppVersion { get; set; }
        public string HostingType { get; set; }

        public ServerConfiguration Server { get; set; } = new ServerConfiguration();
        public ClientConfiguration Client { get; set; } = new ClientConfiguration();
        public AuthConfiguration Auth { get; set; } = new AuthConfiguration();

        public ContentConfiguration Content { get; set; } = new ContentConfiguration();
        public DataConfiguration Data { get; set; } = new DataConfiguration();
        public EmailConfiguration Email { get; set; } = new EmailConfiguration();
    }
}
