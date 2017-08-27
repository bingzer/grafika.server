using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Extensions;
using Grafika.Utilities;
using Grafika.Web.Infrastructure.Extensions;
using Grafika.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Grafika.Web.Controllers
{
    [Route("users")]
    public class UsersController : Controller
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        [Route("{userId}/{slug?}"), AllowAnonymous]
        public async Task<IActionResult> Index([FromServices] IOptions<ServerConfiguration> serverOpts,
            [FromServices] IAnimationService animationService,
            AnimationQueryOptions options,
            string slug = null)
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
                Thumbnail = new ThumbnailViewModel(user.GetAvatarApiUrl(), 100, 100)
            };

            var model = new UserViewModel
            {
                Animations = animations,
                Options = options,
                User = user
            };

            return View(model);
        }
    }
}