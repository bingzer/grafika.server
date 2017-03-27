using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Microsoft.Extensions.Options;
using Grafika.Configurations;
using Microsoft.AspNetCore.Authorization;

namespace Grafika.Web.Controllers
{
    [Route("")]
    public class SiteController : Controller
    {

        [AllowAnonymous]
        [HttpGet("sitemap.xml")]
        public async Task<IActionResult> GetSiteMap([FromServices] IAnimationService animationService,
            [FromServices] IOptions<ContentConfiguration> contentOpts)
        {
            ViewBag.ContentUrl = contentOpts.Value.Url;
            var animations = await animationService.List(new AnimationQueryOptions { IsPublic = true, IsRemoved = false, PageSize = 100 });

            var result = View("AnimationSiteMap", animations);
            result.ContentType = ContentTypes.Xml;

            return result;
        }
    }
}