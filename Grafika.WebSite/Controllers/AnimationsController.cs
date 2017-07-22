using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Grafika.WebSite.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Grafika.Services.Web.Extensions;

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
        public IActionResult Mine()
        {
            var userIdentity = new UserIdentity(User);
            var options = new AnimationQueryOptions { UserId = userIdentity.Id, IsRemoved = false };

            ViewBag.Page = new PageViewModel
            {
                Title = $"My Animations",
                Description = $"List of my animations - Grafika Animation"
            };

            return View(options);
        }

        [Route("{animationId}"), AllowAnonymous]
        public async Task<IActionResult> Detail([FromRoute] string animationId)
        {
            var animation = await _service.Get(animationId);
            var model = new AnimationViewModel
            {
                Animation = animation
            };

            ViewBag.Page = new PageViewModel
            {
                Title = $"{animation.Name} - Grafika",
                Description = $"{animation.Name} by {animation.Author} - Grafika Animation",
                ThumbnailUrl = animation.GetThumbnailUrl()
            };

            return View(model);
        }

        [Route("{animationId}/player"), AllowAnonymous]
        public async Task<IActionResult> Player(AnimationPlayerViewModel model)
        {
            model.Animation = await _service.Get(model.AnimationId);
            return PartialView(model.TemplateName, model);
        }

        [Route("list"), AllowAnonymous]
        public async Task<IActionResult> List(AnimationQueryOptions options)
        {
            if (string.IsNullOrEmpty(options.TemplateName))
                options.TemplateName = "_List";

            var animations = await _service.List(options);
            var model = new AnimationsViewModel
            {
                Animations = animations,
                Options = options
            };

            return PartialView(options.TemplateName, model);
        }
    }
}