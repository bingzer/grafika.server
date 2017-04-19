using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Grafika.Services;
using Grafika.Animations;
using Grafika.Web.Extensions;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("animations"), Route("api/animations")]
    public class FramesController : Controller
    {
        private readonly IFrameService _service;

        public FramesController(IFrameService service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet("{animationId}/frames")]
        public async Task<IActionResult> GetFrameData(string animationId)
        {
            var shouldInflateData = !Request.AcceptEncodings("deflate") && Request.HasHeader("X-inflate-frames");
            var contentEncoding = shouldInflateData ? null : "deflate";
            var frameData = await _service.GetFrameData(animationId, new FrameData { ContentEncoding = contentEncoding });

            if (frameData == null)
                return NotFound();

            if (!string.IsNullOrEmpty(frameData.ContentEncoding))
                Response.Headers.Add("Content-Encoding", frameData.ContentEncoding);

            return File(frameData.Stream, frameData.ContentType);
        }

        [HttpPost("{animationId}/frames")]
        public async Task<IActionResult> CreateOrUpdateFrameData(string animationId)
        {
            var frameData = new FrameData
            {
                ContentEncoding = Request.Headers["content-encoding"].ToString(),
                ContentType = Request.Headers["content-type"],
                ContentLength = long.Parse(Request.Headers["content-length"]),
                Stream = Request.Body
            };

            await _service.PostFrameData(animationId, frameData);
            return Created(Url.Action("GetFrameData", new { animationId = animationId }), null);
        }
    }
}