using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Grafika.Web.Controllers
{
    public partial class AnimationsController
    {
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
