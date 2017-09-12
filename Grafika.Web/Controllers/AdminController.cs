using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Grafika.Web.Controllers
{
    [Authorize(Roles.Administrator)]
    [Route("/admin")]
    public class AdminController : Controller
    {

    }
}
