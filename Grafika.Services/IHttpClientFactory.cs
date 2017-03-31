using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Grafika.Services
{
    public interface IHttpClientFactory
    {
        IHttpClient CreateHttpClient(HttpMessageHandler handler = null);
    }
}
