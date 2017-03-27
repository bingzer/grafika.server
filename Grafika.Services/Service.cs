namespace Grafika.Services
{
    public class Service : IService
    {
        public IServiceContext Context { get; private set; }
        public IUserIdentity User { get { return Context.Identity; } }

        public Service(IServiceContext serviceContext)
        {
            Context = serviceContext;
        }
    }
}
