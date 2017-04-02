using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Grafika.Services;
using Microsoft.Extensions.Options;
using Grafika.Configurations;
using Microsoft.AspNetCore.Authorization;
using Grafika.Services.Models;
using Grafika.Services.Emails;
using Grafika.Web.Models;

namespace Grafika.Web.Controllers
{
    [Route("")]
    public class SiteController : Controller
    {

        [AllowAnonymous]
        [HttpGet("sitemap.xml")]
        public async Task<IActionResult> GetSiteMap([FromServices] IAnimationService animationService,
            [FromServices] IOptions<ContentConfiguration> contentOpts)
        {
            ViewBag.ContentUrl = contentOpts.Value.Url;
            var animations = await animationService.List(new AnimationQueryOptions { IsPublic = true, IsRemoved = false, PageSize = 100 });

            var result = View("AnimationSiteMap", animations);
            result.ContentType = ContentTypes.Xml;

            return result;
        }

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
            else model.FeedbackFrom = "Anonymous";

            await emailService.SendEmail(model);
            return Ok();
        }
    }
}