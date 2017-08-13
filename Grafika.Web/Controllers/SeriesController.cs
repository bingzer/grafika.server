using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Microsoft.AspNetCore.Authorization;

namespace Grafika.Web.Controllers
{
    [Route("animations/series")]
    public class SeriesController : Controller
    {
        private readonly ISeriesService _service;

        public SeriesController(ISeriesService service)
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