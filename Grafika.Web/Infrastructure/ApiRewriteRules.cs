using Grafika.Configurations;
using Grafika.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Grafika.Web.Infrastructure
{
    public class ApiRewriteRules
    {
        static Regex ApiUrlPattern = new Regex(@"\/?api", RegexOptions.IgnoreCase);
        static Regex ApiAnimationCommentsPattern = new Regex(@"\/?animations\/[a-z0-9]*\/comments", RegexOptions.IgnoreCase);

        public static void RewriteToApi(RewriteContext context)
        {
            var httpContext = context.HttpContext;
            var requestServices = httpContext.RequestServices;
            var path = httpContext.Request.Path.Value;

            if (ApiUrlPattern.IsMatch(path))
                return;

            if (IsLegacyApiCall(httpContext))
            {
                var loggerFactory = requestServices.Get<ILoggerFactory>();
                var apiUrl = Utility.CombineUrl("/api", httpContext.Request.Path);

                loggerFactory.CreateLogger<ApiRewriteRules>().LogInformation($"Rewrite URL path from {httpContext.Request.Path} to {apiUrl}. Host is {httpContext.Request.Scheme}://{httpContext.Request.Host}");

                context.HttpContext.Request.Path = apiUrl;
            }
        }

        public static bool IsLegacyApiCall(HttpContext httpContext)
        {
            var path = httpContext.Request.Path.Value;
            var rules = new List<Func<HttpContext, bool>>
            {
                (ctx) =>
                {
                    return ApiAnimationCommentsPattern.IsMatch(path);
                },

                (ctx) =>
                {
                    var userAgent = ctx.Request.Headers["User-Agent"].ElementAtOrDefault(0);
                    return string.IsNullOrEmpty(userAgent) || userAgent.ContainsIgnoreCase("okHttp");
                }
            };

            return rules.Any(rule => rule(httpContext));
        }

    }
}
