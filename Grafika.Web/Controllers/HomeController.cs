using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Grafika.Services;
using System.Threading.Tasks;
using Grafika.Web.ViewModels;
using Grafika.Configurations;
using Microsoft.Extensions.Caching.Memory;
using Grafika.Animations;
using System;
using Grafika.Web.Infrastructure.Extensions;

namespace Grafika.Web.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        [HttpGet, Route(""), AllowAnonymous]
        public async Task<IActionResult> Index(
            [FromServices] IAnimationService animationService,
            [FromServices] IMemoryCache cache, 
            [FromServices] ISeriesService seriesService)
        {
            if (User?.Identity.IsAuthenticated == true)
                return await Mine(animationService);

            var handpickedSeries = await cache.GetOrCreateAsync("HandpickedSeries", (entry) => {
                entry.SlidingExpiration = TimeSpan.FromHours(1);
                return seriesService.GetHandpickedSeries();
            });

            var model = new HomeViewModel
            {
                HandpickedSeries = handpickedSeries,
                UsersCount = AppEnvironment.Default.Server.UsersCount,
                AnimationsCount = AppEnvironment.Default.Server.AnimationsCount
            };

            ViewBag.Page = new PageViewModel();

            return View("Index", model);
        }

        [HttpGet, Route("mine"), Authorize(ActiveAuthenticationSchemes = "cookie-auth")]
        public async Task<IActionResult> Mine([FromServices] IAnimationService animationService)
        {
            var userIdentity = User.Identity as IUserIdentity;
            var options = new AnimationQueryOptions { UserId = userIdentity.Id, IsRemoved = false };

            var model = new AnimationsViewModel
            {
                Animations = await animationService.List(options),
                Options = options
            };

            return View("Mine", model);
        }

        [HttpGet, Route("r"), AllowAnonymous]
        public IActionResult Reroute([FromQuery] RerouteViewModel model)
        {
            switch (model?.Action?.ToLowerInvariant())
            {
                case RerouteViewModel.Verify:
                    return RedirectToAction(nameof(AccountsController.Verify), "Accounts", model);
                case RerouteViewModel.ResetPassword:
                    return RedirectToAction(nameof(AccountsController.Reset), "Accounts", model);
                default:
                    return RedirectToAction(nameof(Index));
            }
        }

        [Route("animations/popup/{animationId}/{slug?}"), AllowAnonymous]
        public IActionResult PlayerPopup(string animationId, string slug = null)
        {
            if (Request.IsCrawler(AppEnvironment.Default.Client))
                return RedirectToAction("Detail", "Animations", new { animationId = animationId, slug = slug });

            var templateName = System.Net.WebUtility.UrlEncode("~/Views/Home/_PlayerPopup.cshtml");
            return Redirect($"/animations/{animationId}/{slug}/player?autoPlay=true&templateName={templateName}");
        }

        [Route("try-it"), Route("try-grafika"), AllowAnonymous]
        public IActionResult Try()
        {
            var model = new AnimationDrawingViewModel
            {
                DrawingControllerName = "LocalDrawingController",
                Animation = new Animation
                {
                    Name = "New Animation",
                }
            };

            ViewBag.Page = new PageViewModel
            {
                Title = $"Create Animation | Grafika",
                UseNavigationBar = false,
                UseFooter = false,
                Description = "Create a stop-motion animation using Grafika web editor. It's free!"
            };

            return View("~/Views/Animations/Edit.cshtml", model);
        }

        [Route("stickdraw"), AllowAnonymous]
        public IActionResult StickDraw()
        {
            ViewBag.Page = PageViewModel.StickDrawPageViewModel;
            return View();
        }

        [Route("about"), AllowAnonymous]
        public IActionResult About()
        {
            ViewBag.Page = new PageViewModel { Title = "About | Grafika" };

            return View();
        }
        
        [Route("eula"), AllowAnonymous]
        public IActionResult Eula()
        {
            ViewBag.Page = new PageViewModel { Title = "EULA | Grafika" };

            return View();
        }

        [Route("feedback"), AllowAnonymous]
        public IActionResult Feedback()
        {
            ViewBag.Page = new PageViewModel { Title = "Feedback | Grafika" };

            return View();
        }
        
        [Route("platforms"), AllowAnonymous]
        public IActionResult Platforms()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Available Platforms | Grafika"
            };

            return View();
        }

        [Route("contribute"), AllowAnonymous]
        public IActionResult Contribute()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Contribute! | Grafika",
                Description = "Contribute to the development of Grafika."
            };

            return View();
        }

        [Route("android"), AllowAnonymous]
        public IActionResult Android()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Android app | Grafika"
            };

            return View();
        }
        
        [Route("online"), AllowAnonymous]
        public IActionResult Online()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Online app | Grafika"
            };

            return View();
        }
        
        [Route("ios"), AllowAnonymous]
        public IActionResult IOS()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "iOS app | Grafika"
            };

            return View();
        }

        [Route("privacy-policy"), AllowAnonymous]
        public IActionResult PrivacyPolicy()
        {
            ViewBag.Page = new PageViewModel { Title = "Privacy Policy | Grafika" };

            return View();
        }
    }
}