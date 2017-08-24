using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Grafika.Configurations;
using Grafika.Web.Models;
using Grafika.Services.Web.Extensions;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("api")]
    public class ServerController : Controller
    {
        [AllowAnonymous]
        [HttpGet, HttpPost]
        public ServerModel Index([FromServices] IHostingEnvironment env, 
            [FromServices] IOptions<ServerConfiguration> serverOpts,
            [FromServices] IOptions<ContentConfiguration> contentOpts)
        {
            return new ServerModel
            {
                Name = serverOpts.Value.Name,
                Description = serverOpts.Value.Description,
                Version = Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion,
                Url = Request.GetServerUrl().ToString(),
                ContentUrl = contentOpts.Value.Url,
                HealthUrl = Url.Action(nameof(GetHealthStatus)),
                EnvironmentName = env.EnvironmentName
            };
        }

        [AllowAnonymous]
        [HttpGet, HttpPost, Route("health")]
        public IActionResult GetHealthStatus()
        {
            return Ok();
        }
    }
}