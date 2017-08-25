using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Microsoft.AspNetCore.Authorization;
using Grafika.Web.Models;
using Grafika.Services.Web.Filters;
using Grafika.Services.Web.Extensions;
using Microsoft.Extensions.Options;
using Grafika.Configurations;
using Grafika.Utilities;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("api/users")]
    public class UsersApiController : Controller
    {
        private readonly IUserService _service;

        public UsersApiController(IUserService service)
        {
            _service = service;
        }

        [Authorize(Roles = Roles.Developer)]
        [HttpGet]
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

        [AllowAnonymous]
        [HttpGet("{userId}/seo"), HttpGet("{userId}/link")]
        public async Task<IActionResult> SeoCrawlerLink([FromServices] IOptions<ClientConfiguration> clientConfig, 
            [FromServices] IOptions<ContentConfiguration> contentConfig,
            string userId)
        {
            var user = await _service.Get(userId);
            if (user == null)
                return NotFound();

            if (Request.IsCrawler(clientConfig.Value))
                return View("UserSeo", user);

            var redirectUrl = Utility.CombineUrl(contentConfig.Value.Url, "users", user.Id);
            return Redirect(redirectUrl);
        }

        [SkipModelValidation]
        [HttpPut("{userId}")]
        public async Task<IActionResult> Update(string userId, [FromBody] User user)
        {
            user.Id = userId;

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