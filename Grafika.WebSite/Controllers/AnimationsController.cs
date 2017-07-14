using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Grafika.WebSite.ViewModels;
using Microsoft.Extensions.Options;
using Grafika.Configurations;
using Microsoft.AspNetCore.Authorization;

namespace Grafika.WebSite.Controllers
{
    [Route("/animations"), AllowAnonymous]
    public class AnimationsController : Controller
    {
        private readonly IAnimationService _service;

        public AnimationsController(IAnimationService animationService)
        {
            _service = animationService;
        }

        [Route("")]
        public async Task<IActionResult> Index([FromServices] IOptions<ServerConfiguration> serverOpts, AnimationQueryOptions options)
        {
            if (options == null)
                options = new AnimationQueryOptions();
            if (options.UserId != null)
                options = AnimationQueryOptions.MyAnimations(options);
            else
                options = AnimationQueryOptions.PublicAnimations(options);

            var animations = await _service.List(options);
            var model = new AnimationsViewModel
            {
                ApiUrl = serverOpts.Value.Url,
                Animations = animations,
                Options = options
            };

            return View("Index", model);
        }
    }
}