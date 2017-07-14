using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Microsoft.AspNetCore.Authorization;

namespace Grafika.WebSite.Controllers
{
    [Route("/"), AllowAnonymous]
    public class HomeController : Controller
    {
        [Route("/")]
        public IActionResult Index()
        {
            return View();
        }


        //public async Task<IActionResult> GetRandomAnimation(
        //    [FromServices] IAnimationService animationService,
        //    [FromServices] IFrameService frameService)
        //{
        //    var animations = await animationService.List(new AnimationQueryOptions { IsPublic = true, IsRandom = true });
        //    var animation = animations.FirstOrDefault();

        //    return Ok(animation);
        //}
    }
}