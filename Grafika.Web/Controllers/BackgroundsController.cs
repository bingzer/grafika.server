using Grafika.Animations;
using Grafika.Services;
using Grafika.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("backgrounds"), Route("api/backgrounds")]
    public class BackgroundsController : Controller
    {
        private readonly IBackgroundService _service;

        public BackgroundsController(IBackgroundService service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(BackgroundQueryOptions options, [FromQuery] int? skip = null, [FromQuery] int? limit = null)
        {
            if (options == null)
                options = new BackgroundQueryOptions();
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

            var backgrounds = await _service.List(options);
            return Ok(backgrounds);
        }

        [HttpGet("mine")]
        public Task<IActionResult> GetMine([FromQuery] BackgroundQueryOptions options = null)
        {
            if (options == null)
                options = new BackgroundQueryOptions();
            options.UserId = ((UserIdentity)User.Identity).Id;

            return Get(options);
        }

        [AllowAnonymous]
        [HttpGet("{backgroundId}")]
        public async Task<IActionResult> GetDetail(string backgroundId)
        {
            var animation = await _service.Get(backgroundId);
            if (animation == null) return NotFound();
            return Ok(animation);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromServices] IUserService userService, [FromBody] Background background)
        {
            var user = await userService.Get((User.Identity as IUserIdentity).Id);
            if (user == null)
                throw new NotAuthorizedException();

            background = await _service.Create(background);

            return Created(Url.Action(nameof(Get), new { animationId = background.Id }), background);
        }
        
        [HttpPut("{backgroundId}")]
        public async Task<IActionResult> Update(string backgroundId, [FromBody] Background background)
        {
            background.Id = backgroundId;

            background = await _service.Update(background);
            return Ok();
        }

        [HttpDelete("{backgroundId}")]
        public async Task<IActionResult> Delete(string backgroundId)
        {
            await _service.Delete(backgroundId);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("{backgroundId}/frames")]
        public async Task<IActionResult> GetFrameData(string backgroundId)
        {
            var shouldInflateData = !Request.AcceptEncodings("deflate") && Request.HasHeader("X-inflate-frames");
            var contentEncoding = shouldInflateData ? null : "deflate";
            var frameData = await _service.GetFrameData(backgroundId, new FrameData { ContentEncoding = contentEncoding });

            if (frameData == null)
                return NotFound();

            if (!string.IsNullOrEmpty(frameData.ContentEncoding))
                Response.Headers.Add("Content-Encoding", frameData.ContentEncoding);

            return File(frameData.Stream, frameData.ContentType);
        }

        [HttpPost("{backgroundId}/frames")]
        public async Task<IActionResult> CreateOrUpdateFrameData(string backgroundId)
        {
            var frameData = new FrameData
            {
                ContentEncoding = Request.Headers["content-encoding"].ToString(),
                ContentType = Request.Headers["content-type"],
                ContentLength = long.Parse(Request.Headers["content-length"]),
                Stream = Request.Body
            };

            await _service.PostFrameData(backgroundId, frameData);
            return Created(Url.Action(nameof(GetFrameData), new { backgroundId = backgroundId }), null);
        }

        [AllowAnonymous]
        [HttpHead("{backgroundId}/thumbnail")]
        public async Task<IActionResult> HasThumbnail(string backgroundId)
        {
            var hasThumbnail = await _service.HasThumbnail(backgroundId);
            if (!hasThumbnail)
                return NotFound();

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("{backgroundId}/thumbnail")]
        public async Task<IActionResult> GetThumbnail(string backgroundId)
        {
            var url = await _service.GetThumbnailUrl(backgroundId);
            return Redirect(url);
        }

        [HttpPost("{backgroundId}/thumbnail")]
        public async Task<IActionResult> CreateThumbnailSignedUrl(string backgroundId)
        {
            var url = await _service.CreateThumbnail(backgroundId);
            return Ok(url);
        }
    }
}