using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Microsoft.AspNetCore.Authorization;

namespace Grafika.Web.Controllers
{
    [Route("api/animations/series")]
    public class SeriesApiController : Controller
    {
        private readonly ISeriesService _service;

        public SeriesApiController(ISeriesService service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get(SeriesQueryOptions options, [FromQuery] int? skip = null, [FromQuery] int? limit = null)
        {
            var series = await _service.List(options);
            return Ok(series);
        }

        [AllowAnonymous]
        [HttpGet("{seriesId}")]
        public async Task<IActionResult> Get(string seriesId)
        {
            var series = await _service.Get(seriesId);
            if (series == null) return NotFound();
            return Ok(series);
        }
    }
}