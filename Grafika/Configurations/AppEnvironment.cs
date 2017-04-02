namespace Grafika.Configurations
{
    public sealed class AppEnvironment : ServerInfo
    {
        public static readonly AppEnvironment Default = new AppEnvironment();

        private AppEnvironment()
        {

        }
    }
}
