using Grafika.Configurations;
using Grafika.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace Grafika.Services.Web.Extensions
{
    /// <summary>
    /// TODO: MOVE ME
    /// </summary>
    public static class HttpRequestExtensions
    {
        public static bool AcceptEncodings(this HttpRequest req, string encoding)
        {
            var acceptEncodingHeader = req.Headers.FirstOrDefault(h => "accept-encoding".EqualsIgnoreCase(h.Key));
            return acceptEncodingHeader.Value.Any(str => str.ContainsIgnoreCase("deflate"));
        }

        public static bool HasHeaderWithValue(this HttpRequest req, string key, string value)
        {
            var header = req.Headers.FirstOrDefault(h => h.Key.EqualsIgnoreCase(key));
            return header.Value.ToString().EqualsIgnoreCase(key);
        }

        public static bool HasHeader(this HttpRequest req, string key)
        {
            return req.Headers.Any(h => h.Key.EqualsIgnoreCase(key));
        }

        public static Uri GetServerUrl(this HttpRequest request)
        {
            var uriBuilder = new UriBuilder(request.Scheme, request.Host.Host);
            if (request.Host.Port.HasValue)
                uriBuilder.Port = request.Host.Port.Value;
            return uriBuilder.Uri;
        }

        public static bool IsCrawler(this HttpRequest request, ClientConfiguration config)
        {
            var userAgent = request.Headers["User-Agent"];

            var crawler = config.CrawlerRegex;
            return Regex.IsMatch(userAgent, crawler, RegexOptions.IgnoreCase);
        }
    }
}
