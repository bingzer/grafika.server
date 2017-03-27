using Grafika.Animations;
using Grafika.Web.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Grafika.Web.Controllers
{
    public partial class AnimationsController
    {

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
