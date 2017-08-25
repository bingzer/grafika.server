using Grafika.Web.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Grafika.Web.Controllers
{
    [Route("uploads")]
    public class FileUploadController : Controller
    {
        [Route("image")]
        public IActionResult ImageUpload(ImageFileUploadViewModel model)
        {
            return PartialView("_ImageUploader", model);
        }
    }
}
