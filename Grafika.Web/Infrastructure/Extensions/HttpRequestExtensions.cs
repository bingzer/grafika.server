using Grafika.Configurations;
using Grafika.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Primitives;
using System;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;

namespace Grafika.Web.Infrastructure.Extensions
{
    /// <summary>
    /// TODO: MOVE ME
    /// </summary>
    public static class HttpRequestExtensions
    {
        public static bool Accept(this HttpRequest req, string contentType)
        {
            var acceptHeader = req.Headers.FirstOrDefault(h => "accept".EqualsIgnoreCase(h.Key));
            return acceptHeader.Value.Any(str => str.ContainsIgnoreCase(contentType));
        }

        public static bool AcceptEncodings(this HttpRequest req, string encoding)
        {
            var acceptEncodingHeader = req.Headers.FirstOrDefault(h => "accept-encoding".EqualsIgnoreCase(h.Key));
            return acceptEncodingHeader.Value.Any(str => str.ContainsIgnoreCase(encoding));
        }

        public static bool HasHeaderWithValue(this HttpRequest req, string key, string value)
        {
            var header = req.Headers.FirstOrDefault(h => h.Key.EqualsIgnoreCase(key));
            return header.Value.ToString().EqualsIgnoreCase(value);
        }

        public static bool HasHeaderWithValueContains(this HttpRequest req, string key, string value)
        {
            var header = req.Headers.FirstOrDefault(h => h.Key.EqualsIgnoreCase(key));
            return header.Value.ToString().ContainsIgnoreCase(value);
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

        public static Uri GetCurrentUrl(this HttpRequest request)
        {
            var uriBuilder = new UriBuilder(request.Scheme, request.Host.Host);
            if (request.Host.Port.HasValue)
                uriBuilder.Port = request.Host.Port.Value;
            if (request.Path.HasValue)
                uriBuilder.Path = request.Path.Value;
            return uriBuilder.Uri;
        }

        public static bool IsCrawler(this HttpRequest request, ClientConfiguration config)
        {
            var userAgent = request.Headers["User-Agent"];

            var crawler = config.CrawlerRegex;
            return Regex.IsMatch(userAgent, crawler, RegexOptions.IgnoreCase);
        }

        public static bool IsInternetExplorer(this HttpRequest request)
        {
            return request?.HasHeaderWithValueContains("User-Agent", "MSIE") == true ||
                request?.HasHeaderWithValueContains("User-Agent", "Trident") == true;
        }

        public static bool SupportsDeflate(this HttpRequest request)
        {
            return request.AcceptEncodings("deflate") &&
                    !request.HasHeader("X-inflate-frames") && 
                    !request?.Query.ContainsKey("X-inflate-frames") == true &&
                    !request.IsInternetExplorer();
        }

        public static CultureInfo GetCulture(this HttpRequest request)
        {
            var feature = request.HttpContext.Features.Get<IRequestCultureFeature>();
            if (feature == null)
                return CultureInfo.CurrentCulture;
            return feature.RequestCulture.Culture;
        }

        public static CultureInfo GetUICulture(this HttpRequest request)
        {
            var feature = request.HttpContext.Features.Get<IRequestCultureFeature>();
            if (feature == null)
                return CultureInfo.CurrentUICulture;
            return feature.RequestCulture.UICulture;
        }
    }
}
