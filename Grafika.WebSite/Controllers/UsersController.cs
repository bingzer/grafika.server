using Grafika.Configurations;
using Grafika.Services;
using Grafika.Utilities;
using Grafika.WebSite.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Grafika.WebSite.Controllers
{
    [Route("users")]
    public class UsersController : Controller
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        [Route("{userId}"), AllowAnonymous]
        public async Task<IActionResult> Index([FromServices] IOptions<ServerConfiguration> serverOpts,
            AnimationQueryOptions options)
        {
            var user = await _service.Get(options.UserId);

            var model = new UserViewModel
            {
                User = user,
                AvatarUrl = Utility.CombineUrl(serverOpts.Value.Url, "users", user.Id, "avatar"),
                BackdropUrl = Utility.CombineUrl(serverOpts.Value.Url, "users", user.Id, "backdrop")
            };

            return View(model);
        }
    }
}