using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Grafika.Web.ViewModels;

namespace Grafika.Web.Controllers
{
    [Route("comments")]
    public class CommentsController : Controller
    {
        [Route(""), AllowAnonymous]
        public IActionResult Index(CommentDisqusViewModel model)
        {
            if (model.IsPartial)
                return PartialView(model.TemplateName, model);

            return View(model);
        }
    }
}