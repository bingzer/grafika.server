using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Grafika.Services;
using Grafika.Animations;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("animations"), Route("api/animations")]
    public class ResourcesController : Controller
    {
        private readonly IResourceService _service;
        private readonly IAnimationService _animationService;

        public ResourcesController(IResourceService service, IAnimationService animationService)
        {
            _service = service;
            _animationService = animationService;
        }

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
            var hasThumbnail = await _service.HasResource(EntityType.Animation, animationId, resourceId);

            if (hasThumbnail) return Ok();
            return NotFound();
        }

        [AllowAnonymous]
        [HttpGet("{animationId}/resources/{resourceId}")]
        public async Task<IActionResult> GetResources(string animationId, string resourceId)
        {
            var url = await _service.GetResourceUrl(EntityType.Animation, animationId, resourceId);
            return Redirect(url);
        }

        [HttpPost("{animationId}/resources")]
        public async Task<IActionResult> CreateResourceSignedUrl([FromRoute] string animationId, [FromBody] Resource resource)
        {
            var animation = await _animationService.Get(animationId);
            var url = await _service.CreateResource(animation, resource);
            return Ok(url);
        }

        [HttpDelete("{animationId}/resources/{resourceId}")]
        public async Task<IActionResult> DeleteResource(string animationId, string resourceId)
        {
            if (await _service.DeleteResource(EntityType.Animation, animationId, resourceId))
                return Ok();
            return BadRequest();
        }
    }
}