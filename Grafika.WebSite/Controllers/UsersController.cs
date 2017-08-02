using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Web.Extensions;
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
            [FromServices] IAnimationService animationService,
            AnimationQueryOptions options)
        {
            var userIdentity = User.Identity as IUserIdentity;
            var user = await _service.Get(options.UserId);
            options.IsRemoved = false;
            options.IsPublic = (userIdentity?.Id != user.Id) ? (bool?) true : null;
            var animations = await animationService.List(options);

            ViewBag.Page = new PageViewModel
            {
                Title = $"{user.Username} | Grafika",
                Description = $"List of all grafika animations created by {user.Username} | Grafika",
                Thumbnail = new ThumbnailViewModel(user.GetUserAvatarUrl(), 100, 100)
            };

            var model = new UserViewModel
            {
                Animations = animations,
                Options = options,
                User = user,
                AvatarUrl = Utility.CombineUrl(serverOpts.Value.Url, "users", user.Id, "avatar"),
                BackdropUrl = Utility.CombineUrl(serverOpts.Value.Url, "users", user.Id, "backdrop")
            };

            return View(model);
        }
    }
}