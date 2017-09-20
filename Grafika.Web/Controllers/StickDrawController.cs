using Grafika.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.Web.Controllers
{
    [Route("stickdraw")]
    public class StickDrawController : Controller
    {

        [Route(""), AllowAnonymous]
        public IActionResult Index()
        {
            ViewBag.Page = PageViewModel.StickDrawPageViewModel;
            return View();
        }
    }
}
