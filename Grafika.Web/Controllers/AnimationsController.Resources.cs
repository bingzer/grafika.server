using Grafika.Animations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Grafika.Web.Controllers
{
    public partial class AnimationsController
    {
        [AllowAnonymous]
        [HttpHead("{animationId}/thumbnail")]
        public Task<IActionResult> HasThumbnail(string animationId)
        {
            return HasResource(animationId, Thumbnail.ResourceId);
        }

        [AllowAnonymous]
        [HttpGet("{animationId}/thumbnail")]
        public Task<IActionResult> GetThumbnail(string animationId)
        {
            return GetResources(animationId, Thumbnail.ResourceId);
        }

        [HttpPost("{animationId}/thumbnail")]
        public Task<IActionResult> CreateThumbnailSignedUrl(string animationId)
        {
            return CreateResourceSignedUrl(animationId, Thumbnail.Create());
        }
        
        [AllowAnonymous]
        [HttpHead("{animationId}/resources/{resourceId}")]
        public async Task<IActionResult> HasResource(string animationId, string resourceId)
        {
            var hasThumbnail = await _service.HasResource(animationId, resourceId);

            if (hasThumbnail) return Ok();
            return NotFound();
        }

        [AllowAnonymous]
        [HttpGet("{animationId}/resources/{resourceId}")]
        public async Task<IActionResult> GetResources(string animationId, string resourceId)
        {
            var url = await _service.GetResourceUrl(animationId, resourceId);
            return Redirect(url);
        }

        [HttpPost("{animationId}/resources")]
        public async Task<IActionResult> CreateResourceSignedUrl([FromRoute] string animationId, [FromBody] Resource resource)
        {
            var url = await _service.CreateResource(animationId, resource);
            return Ok(url);
        }
    }
}
