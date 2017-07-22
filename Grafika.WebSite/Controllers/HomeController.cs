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
        [Route("/"), AllowAnonymous]
        public async Task<IActionResult> Index([FromServices] ISeriesService seriesService)
        {
            var model = new HomeViewModel
            {
                HandpickedSeries = await seriesService.GetHandpickedSeries(),
                UsersCount = AppEnvironment.Default.Content.UsersCount,
                AnimationsCount = AppEnvironment.Default.Content.AnimationsCount
            };

            return View("Index", model);
        }

        [Route("/stickdraw"), AllowAnonymous]
        public IActionResult StickDraw()
        {
            return View();
        }
    }
}