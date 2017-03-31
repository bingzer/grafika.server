using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public class HttpClientDecorator : IHttpClient
    {
        private readonly HttpClient _client;

        public HttpClientDecorator()
            : this(null)
        {
        }

        public HttpClientDecorator(HttpMessageHandler handler)
        {
            if (handler != null)
                _client = new HttpClient(handler);
            else _client = new HttpClient();
        }

        public Task<HttpResponseMessage> DeleteAsync(string url)
        {
            return _client.DeleteAsync(url);
        }

        public void Dispose()
        {
            _client.Dispose();
        }

        public Task<HttpResponseMessage> GetAsync(string url)
        {
            return _client.GetAsync(url);
        }

        public Task<byte[]> GetByteArrayAsync(string url)
        {
            return _client.GetByteArrayAsync(url);
        }

        public Task<Stream> GetStreamAsync(string url)
        {
            return _client.GetStreamAsync(url);
        }

        public Task<string> GetStringAsync(string url)
        {
            return _client.GetStringAsync(url);
        }

        public Task<HttpResponseMessage> PostAsync(string url, HttpContent content)
        {
            return _client.PostAsync(url, content);
        }

        public Task<HttpResponseMessage> PutAsync(string url, HttpContent content)
        {
            return _client.PutAsync(url, content);
        }

        public Task<HttpResponseMessage> SendAsync(HttpRequestMessage request)
        {
            return _client.SendAsync(request);
        }
    }
}
