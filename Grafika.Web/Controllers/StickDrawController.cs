using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Comments;
using Grafika.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.Web.Controllers
{
    [Route("stickdraw")]
    public class StickDrawController : Controller
    {

        [Route(""), AllowAnonymous]
        public IActionResult Index()
        {
            ViewBag.Page = PageViewModel.StickDrawPageViewModel;
            return View();
        }

        [Route("/api/stickdraw/comments"), AllowAnonymous]
        public async Task<IActionResult> Comments(
            [FromServices] IAccountService accountService,
            [FromServices] ICommentService commentService,
            [FromServices] IOptions<ServerConfiguration> serverOpts)
        {
            User user = null;
            if (User.Identity as IUserIdentity != null)
                user = new User(User.Identity as IUserIdentity);

            var commentAuthenticationContext = new CommentAuthenticationContext
            {
                Id = "page-stickdraw",
                Title = PageViewModel.StickDrawPageViewModel.Title,
                ServerUrl = serverOpts.Value.Url,
                UserToken = user == null ? AuthenticationToken.Empty : await accountService.GenerateUserToken(user)
            };

            var url = await commentService.GenerateRemoteUrl(commentAuthenticationContext);

            var urlBuilder = new UriBuilder(url);
            // append other query string
            var queryString = QueryString.FromUriComponent(url.Query).Add(Request.QueryString);
            urlBuilder.Query = queryString.ToUriComponent();

            return Redirect(urlBuilder.ToString());
        }
    }
}
