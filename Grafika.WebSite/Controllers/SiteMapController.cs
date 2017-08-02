using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SimpleMvcSitemap;
using Grafika.Services;
using Grafika.Services.Web.Extensions;
using SimpleMvcSitemap.Images;
using Microsoft.AspNetCore.Authorization;

namespace Grafika.WebSite.Controllers
{
    [AllowAnonymous]
    public class SiteMapController : Controller
    {
        /// <summary>
        /// Site map for static pages
        /// </summary>
        /// <returns></returns>
        [Route("sitemap.xml")]
        public IActionResult Index()
        {
            var nodes = new List<SitemapNode>
            {
                new SitemapNode(Url.Action("Index", "Home")),
                new SitemapNode(Url.Action("About", "Home")),
                new SitemapNode(Url.Action("Eula", "Home")),
                new SitemapNode(Url.Action("PrivacyPolicy", "Home")),
                new SitemapNode(Url.Action("StickDraw", "Home")),
                new SitemapNode(Url.Action("Platforms", "Home")),
                new SitemapNode(Url.Action("Android", "Home")),
                new SitemapNode(Url.Action("Online", "Home")),
                new SitemapNode(Url.Action("IOS", "Home"))
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
        public async Task<IActionResult> Animations([FromServices] ISeriesService seriesService, [FromServices] IAnimationService animationService)
        {
            // TODO: Moved this code a service

            var handpicked = (await seriesService.GetHandpickedSeries()).Animations;

            var options = new AnimationQueryOptions { IsPublic = true, IsRemoved = false, MinimumFrames = 10, PageSize = 100 };
            var otherAnimations = await animationService.List(options);
            var animations = handpicked.Union(otherAnimations).Distinct();

            var nodes = animations.Select(animation => 
                new SitemapNode($"/animations/{animation.Id}/{animation.GetSlug()}")
                {
                    Images = new List<SitemapImage>
                    {
                        new SitemapImage(animation.GetThumbnailUrl())
                        {
                            Caption =  $"{animation.Name}. An animation by {animation.Author} | Grafika",
                            Title = $"{animation.Name} | Grafika",
                            Url = animation.GetThumbnailUrl()
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
        public async Task<IActionResult> Users([FromServices] IUserService userService)
        {
            // TODO: Moved this code a service
            var options = new UserQueryOptions { PageSize = 100 };
            var users = await userService.List(options);

            // TODO: also support /users/{username}
            var nodes = users.Select(user => new SitemapNode($"/animations/{user.Id}"));

            return new SitemapProvider().CreateSitemap(new SitemapModel(nodes.ToList()));
        }
    }
}