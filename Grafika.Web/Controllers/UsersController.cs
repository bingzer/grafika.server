using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Microsoft.AspNetCore.Authorization;
using Grafika.Web.Models;
using Grafika.Web.Filters;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("[controller]"), Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        [Authorize(Roles = Roles.Developer)]
        public async Task<IActionResult> GetUsers([FromQuery] UserQueryOptions options, [FromQuery] int? skip, [FromQuery] int? limit)
        {
            if (options == null)
                options = new UserQueryOptions();
            options.SetPaging(skip, limit);

            var users = await _service.List(options);
            return Ok(users);
        }

        [AllowAnonymous]
        [HttpGet("{userId}")]
        public async Task<IActionResult> Get(string userId)
        {
            var user = await _service.Get(userId);
            return Ok(user);
        }

        [SkipModelValidation]
        [HttpPut("{userId}")]
        public async Task<IActionResult> Update([FromBody] User user)
        {
            var identity = User?.Identity as UserIdentity;
            if (identity?.Id == user.Id)
            {
                await _service.Update(user);
                return Ok();
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpGet("{userId}/{type:regex(avatar|backdrop)}")]
        public async Task<IActionResult> GetAvatarOrBackdropUrl(string userId, string type)
        {
            var avatarUrl = await _service.GetAvatarOrBackdropUrl(userId, type);
            return Redirect(avatarUrl);
        }

        [HttpPost("{userId}/{type:regex(avatar|backdrop)}")]
        public async Task<IActionResult> CreateSignedUrl(string userId, [FromBody] UserCreateSignedUrlModel model)
        {
            var signedUrl = await _service.CreateSignedUrl(userId, model.ImageType, model.ContentType);
            return Ok(signedUrl);
        }
    }
}