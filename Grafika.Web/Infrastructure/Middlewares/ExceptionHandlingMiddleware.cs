﻿using Grafika.Web.Infrastructure.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Grafika.Web.Infrastructure.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ILogger<ExceptionHandlingMiddleware> logger, IHostingEnvironment env /* other scoped dependencies */)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                logger.LogCritical("{0}", ex);

                await HandleExceptionAsync(env, _next, context, ex);
            }
        }

        private static Task HandleExceptionAsync(IHostingEnvironment env, RequestDelegate next, HttpContext context, Exception exception)
        {
            var message = UserException.DefaultErrorMessage;
            var code = HttpStatusCode.InternalServerError; // 500 if unexpected

            if (exception is NotFoundExeption)
                code = HttpStatusCode.NotFound;
            else if (exception is NotAuthorizedException)
                code = HttpStatusCode.Unauthorized;
            else if (exception is NotValidException)
                code = HttpStatusCode.BadRequest;
            else if (exception is NotAllowedException)
                code = HttpStatusCode.Forbidden;

            if (exception is UserException)
                message = exception.Message;

            var detail = "";
            if (env.IsDevelopment())
            {
                detail = exception.ToString();
            }

            if (ApiRewriteRules.IsLegacyApiCall(context))
            {
                context.Response.ContentType = ContentTypes.Text;
                context.Response.StatusCode = (int)code;
                return context.Response.WriteAsync(message);
            }

            if (!ApiRewriteRules.IsApiCall(context))
            {
                context.Response.Redirect("/error/" + (int) code);
                return Task.FromResult(0);
            }

            context.Response.ContentType = ContentTypes.Json;
            context.Response.StatusCode = (int)code;

            return context.Response.WriteAsync(JsonConvert.SerializeObject(new { message = message, detail = detail }));
        }
    }
}
