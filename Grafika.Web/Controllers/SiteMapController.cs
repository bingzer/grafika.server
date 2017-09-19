using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SimpleMvcSitemap;
using Grafika.Services;
using SimpleMvcSitemap.Images;
using Microsoft.AspNetCore.Authorization;
using Grafika.Web.Infrastructure.Extensions;
using Grafika.Services.Extensions;
using Microsoft.Extensions.Options;
using Grafika.Configurations;
using Grafika.Utilities;

namespace Grafika.Web.Controllers
{
    [AllowAnonymous]
    public class SiteMapController : Controller
    {
        /// <summary>
        /// Site map for static pages
        /// </summary>
        /// <returns></returns>
        [Route("sitemap.xml")]
        public IActionResult Index([FromServices] IOptions<ServerConfiguration> serverOpts)
        {
            var config = serverOpts.Value;
            var nodes = new List<SitemapNode>
            {
                new SitemapNode(Utility.CombineUrl(config.Url)) { Priority = 1 },
                new SitemapNode(Utility.CombineUrl(config.Url, "animations")) { Priority = (decimal) 0.9 },
                new SitemapNode(Utility.CombineUrl(config.Url, "animations/recents")) { Priority = (decimal) 0.5 },
                new SitemapNode(Utility.CombineUrl(config.Url, "try-grafika")),
                new SitemapNode(Utility.CombineUrl(config.Url, "platforms")),
                new SitemapNode(Utility.CombineUrl(config.Url, "android")),
                new SitemapNode(Utility.CombineUrl(config.Url, "online")),
                new SitemapNode(Utility.CombineUrl(config.Url, "ios")),
                new SitemapNode(Utility.CombineUrl(config.Url, "stickdraw")),
                new SitemapNode(Utility.CombineUrl(config.Url, "contribute")),
                new SitemapNode(Utility.CombineUrl(config.Url, "about")),
                new SitemapNode(Utility.CombineUrl(config.Url, "eula")),
                new SitemapNode(Utility.CombineUrl(config.Url, "privacy-policy")),
                //other nodes
            };

            return new SitemapProvider().CreateSitemap(new SitemapModel(nodes));
        }

        /// <summary>
        /// For animation pages
        /// </summary>
        /// <param name="seriesService"></param>
        /// <param name="animationService"></param>
        /// <returns></returns>
        [Route("sitemap-animations.xml")]
        public async Task<IActionResult> Animations([FromServices] IOptions<ServerConfiguration> serverOpts,
            [FromServices] ISeriesService seriesService, 
            [FromServices] IAnimationService animationService)
        {
            // TODO: Moved this code a service
            var config = serverOpts.Value;

            var handpicked = (await seriesService.GetHandpickedSeries()).Animations;

            var options = new AnimationQueryOptions { IsPublic = true, IsRemoved = false, MinimumFrames = 10, PageSize = config.AnimationsSearchableCount };
            var otherAnimations = await animationService.List(options);
            var animations = handpicked.Union(otherAnimations).Distinct();

            var nodes = animations.Select(animation => 
                new SitemapNode(animation.GetUrl())
                {
                    LastModificationDate = animation.DateTimeModified?.UtcDateTime,
                    Images = new List<SitemapImage>
                    {
                        new SitemapImage(animation.GetThumbnailApiUrl())
                        {
                            Caption =  $"{animation.Name}. An animation by {animation.Author} | Grafika",
                            Title = $"{animation.Name} | Grafika",
                            Url = animation.GetThumbnailApiUrl()
                        }
                        
                    }
                });

            return new SitemapProvider().CreateSitemap(new SitemapModel(nodes.ToList()));
        }

        /// <summary>
        /// For animation pages
        /// </summary>
        /// <param name="seriesService"></param>
        /// <param name="animationService"></param>
        /// <returns></returns>
        [Route("sitemap-users.xml")]
        public async Task<IActionResult> Users([FromServices] IOptions<ServerConfiguration> serverOpts,
            [FromServices] IUserService userService)
        {
            var config = serverOpts.Value;

            // TODO: Moved this code a service
            var options = new UserQueryOptions { PageSize = config.UsersSearchableCount };
            var users = await userService.List(options);

            // TODO: also support /users/{username}
            var nodes = users.Select(user => new SitemapNode(user.GetUrl()));

            return new SitemapProvider().CreateSitemap(new SitemapModel(nodes.ToList()));
        }
    }
}