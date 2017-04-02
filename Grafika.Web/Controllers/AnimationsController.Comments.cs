using Grafika.Services;
using Grafika.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Grafika.Web.Controllers
{
    public partial class AnimationsController
    {
        [AllowAnonymous]
        [HttpGet("{animationId}/comments")]
        public async Task<IActionResult> GetRemoteCommentUrl([FromServices] ICommentService disqusService, 
            [FromServices] IUserService userService,
            string animationId)
        {
            var animation = await _service.Get(animationId);
            if (animation == null)
                return NotFound();

            User user = null;
            if (User.Identity as IUserIdentity != null)
                user = new User(User.Identity as IUserIdentity);

            var url = await disqusService.GenerateDisqusRemoteUrl(animation, user);

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
