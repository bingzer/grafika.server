using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Animations;
using Grafika.Services;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Grafika.Configurations;
using Microsoft.Extensions.Options;
using Grafika.Utilities;
using Grafika.Services.Web.Extensions;
using Grafika.Services.Web.Filters;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("api/animations")]
    public class AnimationsApiController : Controller
    {
        private readonly IAnimationService _service;

        public AnimationsApiController(IAnimationService animationService)
        {
            _service = animationService;
        }
        
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(AnimationQueryOptions options, [FromQuery] int? skip = null, [FromQuery] int? limit = null)
        {
            if (options == null)
                options = new AnimationQueryOptions();
            if (options.UserId != null)
                options = AnimationQueryOptions.MyAnimations(options);
            else
                options = AnimationQueryOptions.PublicAnimations(options);

            options.SetPaging(skip, limit);

            var animations = await _service.List(options);
            return Ok(animations);
        }

        [AllowAnonymous]
        [HttpGet("{animationId}")]
        public async Task<IActionResult> GetDetail(string animationId)
        {
            var animation = await _service.Get(animationId);
            if (animation == null) return NotFound();
            return Ok(animation);
        }

        [AllowAnonymous]
        [HttpGet("{animationId}/related")]
        public async Task<IActionResult> GetRelatedAnimations(string animationId, int count = 5)
        {
            var options = new AnimationQueryOptions { RelatedToAnimationId = animationId, PageSize = count };

            var animations = await _service.List(options);
            return Ok(animations);
        }

        [AllowAnonymous]
        [HttpGet("random")]
        public async Task<IActionResult> GetRandomAnimation()
        {
            var options = new AnimationQueryOptions { IsRandom = true };

            var animations = await _service.List(options);
            var animation = animations.FirstOrDefault();
            if (animation == null)
                return NotFound();

            return Ok(animation);
        }

        [HttpGet("mine")]
        public Task<IActionResult> GetMine([FromQuery] AnimationQueryOptions options = null)
        {
            if (options == null)
                options = new AnimationQueryOptions();
            options.UserId = ((UserIdentity)User.Identity).Id;

            return Get(options);
        }

        [SkipModelValidation]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Animation animation)
        {
            animation = await _service.Create(animation);

            return Created(Url.Action(nameof(GetDetail), new { animationId = animation.Id }), animation);
        }

        [SkipModelValidation]
        [HttpPut("{animationId}")]
        public async Task<IActionResult> Update(string animationId, [FromBody] Animation animation)
        {
            animation.Id = animationId;

            animation = await _service.Update(animation);
            return Ok();
        }

        [HttpDelete("{animationId}")]
        public async Task<IActionResult> Delete(string animationId)
        {
            await _service.Delete(animationId);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("{animationId}/view")]
        public async Task<IActionResult> IncrementViewCount(string animationId)
        {
            await _service.IncrementViewCount(animationId);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("{animationId}/rating/{rating:range(1,5)}")]
        public async Task<IActionResult> SubmitRating(string animationId, int rating)
        {
            await _service.SubmitRating(animationId, rating);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("{animationId}/seo"), HttpGet("{animationId}/link")]
        public async Task<IActionResult> SeoCrawlerLink([FromServices] IOptions<ServerConfiguration> serverOpts, 
            [FromServices] IOptions<ClientConfiguration> clientConfig,
            string animationId)
        {
            var animation = await _service.Get(animationId);
            if (animation == null)
                throw new NotFoundExeption();

            if (Request.IsCrawler(clientConfig.Value))
                return View("AnimationSeo", animation);

            var redirectUrl = Utility.CombineUrl(serverOpts.Value.Url, "animations", animation.Id);
            return Redirect(redirectUrl);
        }
    }
}