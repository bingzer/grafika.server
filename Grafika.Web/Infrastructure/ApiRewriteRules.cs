using Grafika.Utilities;
using Microsoft.AspNetCore.Rewrite;
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
            var path = context.HttpContext.Request.Path.Value;
            if (ApiUrlPattern.IsMatch(path))
                return;

            var rules = new List<Func<RewriteContext, bool>>
            {
                (ctx) =>
                {
                    return ApiAnimationCommentsPattern.IsMatch(path);
                },

                (ctx) =>
                {
                    var userAgent = ctx.HttpContext.Request.Headers["User-Agent"].ElementAtOrDefault(0);
                    return string.IsNullOrEmpty(userAgent) || userAgent.ContainsIgnoreCase("okHttp");
                }
            };

            if (rules.Any(rule => rule(context)))
            {
                var apiUrl = Utility.CombineUrl("/api", context.HttpContext.Request.Path);
                context.HttpContext.Request.Path = apiUrl;
            }
        }
    }
}
