using Grafika.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Authorize("Administrator")]
    [Route("api/admin")]
    public class AdminApiController : Controller
    {
        private readonly IAdminService _adminService;

        public AdminApiController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        public async Task<IActionResult> GetServerInfo()
        {
            var serverInfo = await _adminService.GetServerInfo();
            return Ok(serverInfo);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(UserQueryOptions options, [FromQuery] int? skip, [FromQuery] int? limit)
        {
            if (options == null)
                options = new UserQueryOptions();
            options.SetPaging(skip, limit);

            var users = await _adminService.GetUsers(options);
            return Ok(users);
        }

        [HttpGet("animations")]
        public async Task<IActionResult> GetAnimations(AnimationQueryOptions options)
        {
            var users = await _adminService.GetAnimations(options);
            return Ok(users);
        }

        [HttpPost("users/{userId}/inactivate")]
        public async Task<IActionResult> InactivateUser(string userId)
        {
            await _adminService.InactivateUser(userId);
            return Ok();
        }

        [HttpPost("users/{userId}/activate")]
        public async Task<IActionResult> ActivateUser(string userId)
        {
            await _adminService.ActivateUser(userId);
            return Ok();
        }

        [HttpPost("users/{userId}/reset-pwd")]
        public async Task<IActionResult> ResetUserPassword(string userId)
        {
            await _adminService.ResetUserPassword(userId);
            return Ok();
        }

        [HttpPost("users/{userId}/reverify")]
        public async Task<IActionResult> ReverifyUser(string userId)
        {
            await _adminService.ReverifyUser(userId);
            return Ok();
        }
    }
}
