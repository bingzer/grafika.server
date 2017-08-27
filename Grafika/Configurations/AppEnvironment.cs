namespace Grafika.Configurations
{
    public sealed class AppEnvironment : BaseEnvironment
    {
        public static readonly AppEnvironment Default = new AppEnvironment();

        private AppEnvironment()
        {

        }
    }
}
