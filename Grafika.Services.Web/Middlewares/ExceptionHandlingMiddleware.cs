using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Grafika.Services.Web.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context, ILogger<ExceptionHandlingMiddleware> logger, IHostingEnvironment env /* other scoped dependencies */)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                logger.LogCritical("{0}", ex);

                await HandleExceptionAsync(env, context, ex);
            }
        }

        private static Task HandleExceptionAsync(IHostingEnvironment env, HttpContext context, Exception exception)
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
            
            context.Response.ContentType = ContentTypes.Json;
            context.Response.StatusCode = (int)code;

            return context.Response.WriteAsync(JsonConvert.SerializeObject(new { message = message, detail = detail }));
        }
    }
}
