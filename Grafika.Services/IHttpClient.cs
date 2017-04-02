using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface IHttpClient : IDisposable
    {
        Task<HttpResponseMessage> DeleteAsync(string url);
        Task<HttpResponseMessage> GetAsync(string url);
        Task<HttpResponseMessage> PostAsync(string url, HttpContent content);
        Task<HttpResponseMessage> PutAsync(string url, HttpContent content);
        Task<HttpResponseMessage> SendAsync(HttpRequestMessage request);

        Task<byte[]> GetByteArrayAsync(string url);
        Task<Stream> GetStreamAsync(string url);
        Task<string> GetStringAsync(string url);
    }
}
