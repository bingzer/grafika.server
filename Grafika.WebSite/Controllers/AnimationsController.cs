using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Grafika.WebSite.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace Grafika.WebSite.Controllers
{
    [Route("/animations")]
    public class AnimationsController : Controller
    {
        private readonly IAnimationService _service;

        public AnimationsController(IAnimationService animationService)
        {
            _service = animationService;
        }

        [Route(""), AllowAnonymous]
        public async Task<IActionResult> Index(AnimationQueryOptions options)
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
                Animations = animations,
                Options = options
            };

            return View(model);
        }

        [Route("mine")]
        public async Task<IActionResult> Mine()
        {
            var userIdentity = new UserIdentity(User);
            var options = new AnimationQueryOptions { UserId = userIdentity.Id, IsRemoved = false };
            var animations = await _service.List(options);
            var model = new AnimationsViewModel
            {
                Animations = animations,
                Options = options
            };

            return View(model);
        }

        [Route("{animationId}"), AllowAnonymous]
        public async Task<IActionResult> Detail([FromRoute] string animationId)
        {
            var animation = await _service.Get(animationId);
            var model = new AnimationViewModel
            {
                Animation = animation
            };

            return View(model);
        }

        [Route("{animationId}/related"), AllowAnonymous]
        public async Task<IActionResult> Related([FromRoute] string animationId, AnimationQueryOptions options = null)
        {
            if (options == null)
                options = new AnimationQueryOptions();
            options.RelatedToAnimationId = animationId;

            var animations = await _service.List(options);
            var model = new AnimationsViewModel
            {
                Animations = animations
            };

            return PartialView("_RelatedAnimations", model);
        }
    }
}