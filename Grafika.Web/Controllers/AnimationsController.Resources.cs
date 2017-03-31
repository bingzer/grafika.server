using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Grafika.Web.Controllers
{
    public partial class AnimationsController
    {
        [AllowAnonymous]
        [HttpHead("{animationId}/thumbnail")]
        public async Task<IActionResult> HasThumbnail(string animationId)
        {
            var hasThumbnail = await _service.HasThumbnail(animationId);

            if (hasThumbnail) return Ok();
            return NotFound();
        }

        [AllowAnonymous]
        [HttpGet("{animationId}/thumbnail")]
        public async Task<IActionResult> GetThumbnail(string animationId)
        {
            var url = await _service.GetThumbnailUrl(animationId);
            return Redirect(url);
        }

        [HttpPost("{animationId}/thumbnail")]
        public async Task<IActionResult> CreateThumbnailSignedUrl(string animationId)
        {
            var url = await _service.CreateThumbnail(animationId);
            return Ok(url);
        }
    }
}
