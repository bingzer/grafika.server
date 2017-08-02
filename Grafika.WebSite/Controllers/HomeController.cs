using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Grafika.Services;
using System.Threading.Tasks;
using Grafika.WebSite.ViewModels;
using Grafika.Configurations;
using Grafika.Services.Web.Extensions;

namespace Grafika.WebSite.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        [ResponseCache(VaryByHeader = "User-Agent", Duration = 86400)]
        [Route(""), AllowAnonymous]
        public async Task<IActionResult> Index([FromServices] ISeriesService seriesService)
        {
            var model = new HomeViewModel
            {
                HandpickedSeries = await seriesService.GetHandpickedSeries(),
                UsersCount = AppEnvironment.Default.Content.UsersCount,
                AnimationsCount = AppEnvironment.Default.Content.AnimationsCount
            };

            ViewBag.Page = new PageViewModel { UseFooter = false };

            return View("Index", model);
        }

        [Route("animations/popup/{animationId}/{slug?}"), AllowAnonymous]
        public IActionResult PlayerPopup(string animationId, string slug = null)
        {
            if (Request.IsCrawler(AppEnvironment.Default.Client))
                return RedirectToAction("Detail", "Animations", new { animationId = animationId, slug = slug });

            var templateName = System.Net.WebUtility.UrlEncode("~/Views/Home/_PlayerPopup.cshtml");
            return Redirect($"/animations/{animationId}/{slug}/player?autoPlay=true&templateName={templateName}");
        }

        [ResponseCache(VaryByHeader = "User-Agent", Duration = 86400)]
        [Route("stickdraw"), AllowAnonymous]
        public IActionResult StickDraw()
        {
            ViewBag.Page = PageViewModel.StickDrawPageViewModel;
            return View();
        }

        [ResponseCache(VaryByHeader = "User-Agent", Duration = 86400)]
        [Route("about"), AllowAnonymous]
        public IActionResult About()
        {
            ViewBag.Page = new PageViewModel { Title = "About | Grafika" };

            return View();
        }

        [ResponseCache(VaryByHeader = "User-Agent", Duration = 86400)]
        [Route("eula"), AllowAnonymous]
        public IActionResult Eula()
        {
            ViewBag.Page = new PageViewModel { Title = "EULA | Grafika" };

            return View();
        }

        [ResponseCache(VaryByHeader = "User-Agent", Duration = 86400)]
        [Route("feedback"), AllowAnonymous]
        public IActionResult Feedback()
        {
            ViewBag.Page = new PageViewModel { Title = "Feedback | Grafika" };

            return View();
        }

        [ResponseCache(VaryByHeader = "User-Agent", Duration = 86400)]
        [Route("platforms"), AllowAnonymous]
        public IActionResult Platforms()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Available Platforms | Grafika"
            };

            return View();
        }

        [ResponseCache(VaryByHeader = "User-Agent", Duration = 86400)]
        [Route("android"), AllowAnonymous]
        public IActionResult Android()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Android app | Grafika"
            };

            return View();
        }

        [ResponseCache(VaryByHeader = "User-Agent", Duration = 86400)]
        [Route("online"), AllowAnonymous]
        public IActionResult Online()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Online app | Grafika"
            };

            return View();
        }

        [ResponseCache(VaryByHeader = "User-Agent", Duration = 86400)]
        [Route("ios"), AllowAnonymous]
        public IActionResult IOS()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "iOS app | Grafika"
            };

            return View();
        }

        [ResponseCache(VaryByHeader = "User-Agent", Duration = 86400)]
        [Route("privacy-policy"), AllowAnonymous]
        public IActionResult PrivacyPolicy()
        {
            ViewBag.Page = new PageViewModel { Title = "Privacy Policy | Grafika" };

            return View();
        }
    }
}