using System;

namespace Grafika.Services
{
    public interface IServiceContext
    {
        IUserIdentity Identity { get; }

        IServiceProvider ServiceProvider { get; }

        Uri ServerUrl { get; }
    }
}
