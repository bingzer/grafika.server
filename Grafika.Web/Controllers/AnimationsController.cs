using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Grafika.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Grafika.Configurations;
using Grafika.Animations;
using Grafika.Utilities;
using Grafika.Web.Infrastructure.Extensions;
using Grafika.Services.Extensions;

namespace Grafika.Web.Controllers
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

            if (ViewBag.Page as PageViewModel == null)
            {
                ViewBag.Page = new PageViewModel
                {
                    Description = "View all published stop motion animations from Grafika animators around the world",
                    Title = "Public Animations | Grafika"
                };
            }

            return View("Index", model);
        }

        [Route("recents"), AllowAnonymous]
        public Task<IActionResult> Recents(AnimationQueryOptions options)
        {
            options.Sort = new SortOptions { Name = AnimationQueryOptions.SortByLastModified, Direction = SortDirection.Descending };

            ViewBag.Page = new PageViewModel
            {
                Description = "List of recently created stop motion animations from Grafika animators around the world",
                Title = "Recent Animations"
            };

            return Index(options);
        }

        [Route("{animationId}/{slug?}/edit")]
        public async Task<IActionResult> Edit(string animationId, string slug = null)
        {
            var model = new AnimationDrawingViewModel
            {
                Animation = await _service.Get(animationId)
            };

            ViewBag.Page = new PageViewModel
            {
                Title = $"{model.Animation.Name} | Grafika",
                Description = $"{model.Animation.Name}. An animation by {model.Animation.Author} | Grafika Animation",
                Thumbnail = new ThumbnailViewModel(model.Animation.GetThumbnailApiUrl(), model.Animation.Width, model.Animation.Height),
                UseNavigationBar = false,
                UseFooter = false
            };

            return View("Edit", model);
        }

        [Route("{animationId}/{slug?}/player"), AllowAnonymous]
        public async Task<IActionResult> Player(AnimationPlayerViewModel model, string slug = null)
        {
            model.Animation = await _service.Get(model.AnimationId);
            return PartialView(model.TemplateName, model);
        }

        [Route("{animationId}/{slug?}"), AllowAnonymous]
        public async Task<IActionResult> Detail([FromRoute] string animationId, string slug = null)
        {
            var animation = await _service.Get(animationId);
            var model = new AnimationViewModel
            {
                Animation = animation
            };

            ViewBag.Page = new PageViewModel
            {
                Title = $"{animation.Name} | Grafika",
                Description = $"{animation.Name} by {animation.Author} | Grafika Animation",
                Thumbnail = new ThumbnailViewModel(animation.GetThumbnailApiUrl(), animation.Width, animation.Height)
            };

            return View(model);
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

        [Route("forms/create")]
        public async Task<IActionResult> Create([FromServices] IUserService userService)
        {
            var user = await userService.Get((User.Identity as IUserIdentity).Id);

            var model = new Animation
            {
                UserId = user.Id,
                Author = user.Username,
                LocalId = Utility.Guid(),
                Width = 800,
                Height = 480,
                Timer = user.Prefs.DrawingTimer,
                IsPublic = user.Prefs.DrawingIsPublic,
                Client = new Client
                {
                    Name = "GrafikaApp",
                    Browser = Request.Headers["User-Agent"],
                    Version = AppEnvironment.Default.AppVersion
                }
            };

            ViewBag.ApiCreateAnimationUrl = Utility.CombineUrl(AppEnvironment.Default.Server.ApiUrl, "animations");

            return PartialView("_Create", model);
        }
    }
}