using Grafika.Services;
using Grafika.Web.Extensions;
using Microsoft.AspNetCore.Http;
using System;

namespace Grafika.Web.Infrastructure
{
    public class ServiceContext : IServiceContext
    {
        public Uri ServerUrl { get; private set; }
        public IUserIdentity Identity { get; private set; }
        public IServiceProvider ServiceProvider { get; private set; }

        public ServiceContext(IHttpContextAccessor accessor)
        {
            ServiceProvider = accessor?.HttpContext?.RequestServices;
            Identity = accessor?.HttpContext?.User?.Identity as IUserIdentity;

            var request = accessor.HttpContext?.Request;
            if (request != null)
            {
                ServerUrl = request.GetServerUrl();
            }
        }
    }
}
