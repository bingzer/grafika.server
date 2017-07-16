using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Grafika.WebSite.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        [Route("/"), AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }

        [Route("/stickdraw"), AllowAnonymous]
        public IActionResult StickDraw()
        {
            return View();
        }
    }
}