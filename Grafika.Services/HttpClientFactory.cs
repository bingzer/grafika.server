using System.Net.Http;

namespace Grafika.Services
{
    public class HttpClientFactory : IHttpClientFactory
    {
        public IHttpClient CreateHttpClient(HttpMessageHandler handler = null)
        {
            return new HttpClientDecorator(handler);
        }
    }
}
