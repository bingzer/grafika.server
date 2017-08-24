using Grafika.Utilities;
using Microsoft.AspNetCore.Rewrite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Grafika.WebSite.Infrastructure
{
    public class ApiRewriteRules
    {
        static Regex regex = new Regex("\\/?api", RegexOptions.IgnoreCase);

        public static void RewriteToApi(RewriteContext context)
        {
            var rules = new List<Func<RewriteContext, bool>>
            {
                (ctx) =>
                {
                    var path = ctx.HttpContext.Request.Path.Value;
                    return !regex.IsMatch(path);
                },

                (ctx) =>
                {
                    var userAgent = ctx.HttpContext.Request.Headers["User-Agent"].ElementAtOrDefault(0);
                    return string.IsNullOrEmpty(userAgent) || userAgent.ContainsIgnoreCase("okHttp");
                }
            };

            if (rules.All(rule => rule(context)))
            {
                var apiUrl = Utility.CombineUrl("/api", context.HttpContext.Request.Path);
                context.HttpContext.Response.Redirect(apiUrl, true);
            }
        }
    }
}
