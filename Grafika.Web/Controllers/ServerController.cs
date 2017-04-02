using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Grafika.Web.Models;
using Microsoft.Extensions.Options;
using Grafika.Configurations;
using System.Reflection;
using Grafika.Web.Extensions;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route(""), Route("api")]
    public class ServerController : Controller
    {
        [AllowAnonymous]
        [HttpGet, HttpPost]
        public ServerModel Index([FromServices] IOptions<ServerConfiguration> serverOpts)
        {
            return new ServerModel
            {
                Name = serverOpts.Value.Name,
                Description = serverOpts.Value.Description,
                Version = Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion,
                Url = Request.GetServerUrl().ToString(),
                HealthUrl = Url.Action(nameof(GetHealthStatus))
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