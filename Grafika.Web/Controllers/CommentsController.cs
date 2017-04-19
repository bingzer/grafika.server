using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Grafika.Services;
using Grafika.Web.Models;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("animations"), Route("api/animations")]
    public class CommentsController : Controller
    {
        private readonly ICommentService _service;
        private readonly IAnimationService _animationService;
        private readonly IUserService _userService;

        public CommentsController(ICommentService service,
            IAnimationService animationService,
            IUserService userService)
        {
            _service = service;
            _animationService = animationService;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpGet("{animationId}/comments")]
        public async Task<IActionResult> GetRemoteCommentUrl(string animationId)
        {
            var animation = await _animationService.Get(animationId);
            if (animation == null)
                return NotFound();

            User user = null;
            if (User.Identity as IUserIdentity != null)
                user = new User(User.Identity as IUserIdentity);

            var url = await _service.GenerateRemoteUrl(animation, user);

            return Redirect(url.ToString());
        }

        [HttpPost("{animationId}/comments")]
        public async Task<IActionResult> PostComment([FromServices] IAnimationEmailService emailService,
            [FromRoute] string animationId,
            [FromBody] CommentModel comment)
        {
            await emailService.SendAnimationCommentEmail(animationId, comment);
            return Ok();

        }
    }
}