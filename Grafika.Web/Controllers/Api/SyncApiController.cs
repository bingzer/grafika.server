using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Grafika.Web.Models;
using Grafika.Web.Infrastructure.Filters;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("api/animations/sync")]
    public class SyncApiController : Controller
    {
        private readonly ISyncService _syncService;

        public SyncApiController(ISyncService syncService)
        {
            _syncService = syncService;
        }

        [SkipModelValidation]
        [HttpPost()]
        public async Task<IActionResult> Sync([FromBody] LocalChangesModel model)
        {
            var result = await _syncService.Sync(model);
            return Ok(result);
        }

        [SkipModelValidation]
        [HttpPost("update"), HttpPost("commit")]
        public async Task<IActionResult> Commit([FromBody] LocalChangesResultModel model)
        {
            var result = await _syncService.Commit(model.Sync, model.Result);
            return Ok(result);
        }
    }
}