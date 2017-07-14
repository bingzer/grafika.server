using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Grafika.WebSite.Controllers
{
    [Route("/animations")]
    public class AnimationsController : Controller
    {
        [Route("")]
        public IActionResult Index()
        {
            return View();
        }
    }
}