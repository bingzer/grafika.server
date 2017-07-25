using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Grafika.Services;
using System.Threading.Tasks;
using Grafika.WebSite.ViewModels;
using Grafika.Configurations;

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

        [Route("stickdraw"), AllowAnonymous]
        public IActionResult StickDraw()
        {
            ViewBag.Page = new PageViewModel{ Title = "StickDraw" };

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

        [Route("privacy-policy"), AllowAnonymous]
        public IActionResult PrivacyPolicy()
        {
            ViewBag.Page = new PageViewModel { Title = "Privacy Policy - Grafika" };

            return View();
        }
    }
}