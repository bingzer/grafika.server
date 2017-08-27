using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Grafika.Configurations;
using Microsoft.AspNetCore.Authorization;
using Grafika.Services.Models;
using Grafika.Services.Emails;
using Grafika.Web.Models;
using Grafika.Connections;
using System.Linq;
using Grafika.Utilities;

namespace Grafika.Web.Controllers
{
    [Route("api")]
    public class SiteApiController : Controller
    {
        [AllowAnonymous]
        [HttpPost("content/feedback")]
        public async Task<IActionResult> SubmitFeedback([FromServices] ITemplatedEmailService emailService,
            [FromServices] IOptions<EmailConfiguration> emailOpts,
            [FromBody] FeedbackModel feedback)
        {
            var model = emailService.CreateModel<FeedbackEmail>(emailOpts.Value.DefaultFrom, "New feedback: " + feedback.Subject);
            model.Category = feedback.Category;
            model.Content = feedback.Content;
            model.FeedbackFrom = feedback.Email;

            if (string.IsNullOrEmpty(model.FeedbackFrom) && User.Identity is IUserIdentity userIdentity)
                model.FeedbackFrom = userIdentity.Email;
            else model.FeedbackFrom = Grafika.User.Anonymous;

            await emailService.SendEmail(model);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("health/{connectionName}")]
        public async Task<IActionResult> GetHealth([FromServices] IConnectionManager manager, string connectionName)
        {
            using (var connection = manager.Connections.FirstOrDefault(conn => conn.Name.EqualsIgnoreCase(connectionName)))
            {
                if (connection == null)
                    return NotFound();

                await connection.CheckStatus();
                return Ok();
            }
        }
    }
}