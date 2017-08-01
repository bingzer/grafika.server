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

        [Route("stickdraw"), AllowAnonymous]
        public IActionResult StickDraw()
        {
            ViewBag.Page = PageViewModel.StickDrawPageViewModel;
            return View();
        }

        [Route("about"), AllowAnonymous]
        public IActionResult About()
        {
            ViewBag.Page = new PageViewModel { Title = "About - Grafika" };

            return View();
        }

        [Route("eula"), AllowAnonymous]
        public IActionResult Eula()
        {
            ViewBag.Page = new PageViewModel { Title = "EULA - Grafika" };

            return View();
        }

        [Route("feedback"), AllowAnonymous]
        public IActionResult Feedback()
        {
            ViewBag.Page = new PageViewModel { Title = "Feedback - Grafika" };

            return View();
        }

        [Route("platforms"), AllowAnonymous]
        public IActionResult Platforms()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Available Platforms - Grafika"
            };

            return View();
        }

        [Route("android"), AllowAnonymous]
        public IActionResult Android()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Android app - Grafika"
            };

            return View();
        }

        [Route("privacy-policy"), AllowAnonymous]
        public IActionResult PrivacyPolicy()
        {
            ViewBag.Page = new PageViewModel { Title = "Privacy Policy - Grafika" };

            return View();
        }
    }
}