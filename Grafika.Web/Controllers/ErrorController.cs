using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Grafika.Web.ViewModels;
using System.Net;

namespace Grafika.Web.Controllers
{
    [Route("/error")]
    public class ErrorController : Controller
    {
        [HttpGet, Route("{statusCode}"), AllowAnonymous]
        public IActionResult Index(HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        {
            var model = new ErrorViewModel { StatusCode = statusCode };

            switch (statusCode)
            {
                case HttpStatusCode.Unauthorized:
                case HttpStatusCode.Forbidden:
                    model.Title = "You can't do that";
                    model.Description = "You are not authorized to view the page.";
                    break;
                case HttpStatusCode.NotFound:
                    model.Title = "Page Not Found";
                    model.Description = "Page you're looking for cannot be found.";
                    break;
            }

            ViewBag.Page = model;

            return View(model);
        }
    }
}