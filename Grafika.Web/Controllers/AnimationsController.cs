using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Animations;
using Grafika.Services;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Grafika.Configurations;
using Microsoft.Extensions.Options;
using Grafika.Utilities;
using Grafika.Web.Extensions;
using Grafika.Web.Filters;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("[controller]"), Route("api/[controller]")]
    public partial class AnimationsController : Controller
    {
        private readonly IAnimationService _service;

        public AnimationsController(IAnimationService animationService)
        {
            _service = animationService;
        }
        
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(AnimationQueryOptions options, [FromQuery] int? skip, [FromQuery] int? limit)
        {
            if (options == null)
                options = new AnimationQueryOptions();
            if (options.UserId != null)
            {
                if (!options.IsRemoved.HasValue)
                    options.IsRemoved = false;
            }
            else
            {
                if (!options.IsPublic.HasValue)
                    options.IsPublic = true;
                if (!options.IsRemoved.HasValue)
                    options.IsRemoved = false;
            }

            options.SetPaging(skip, limit);

            var animations = await _service.List(options);
            return Ok(animations);
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
        public async Task<IActionResult> GetMine([FromQuery] AnimationQueryOptions options = null)
        {
            if (options == null)
                options = new AnimationQueryOptions();
            options.UserId = ((UserIdentity)User.Identity).Id;

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

        [SkipModelValidation]
        [HttpPost]
        public async Task<IActionResult> Create([FromServices] IUserService userService, [FromBody] Animation animation)
        {
            var user = await userService.Get((User.Identity as IUserIdentity).Id);
            if (user == null)
                throw new NotAuthorizedException();

            animation = await _service.PrepareNewAnimation(animation, user);
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
        public async Task<IActionResult> SeoCrawlerLink([FromServices] IOptions<ContentConfiguration> contentConfig, 
            [FromServices] IOptions<ClientConfiguration> clientConfig,
            string animationId)
        {
            var animation = await _service.Get(animationId);
            if (animation == null)
                throw new NotFoundExeption();

            if (Request.IsCrawler(clientConfig.Value))
                return View("AnimationSeo", animation);

            var redirectUrl = Utility.CombineUrl(contentConfig.Value.Url, "animations", animation.Id);
            return Redirect(redirectUrl);
        }
    }
}