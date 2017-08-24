using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grafika.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Grafika.Configurations;
using Microsoft.Extensions.Options;
using Grafika.Services;
using Grafika.Utilities;

namespace Grafika.Web.Controllers
{
    [Produces("application/json")]
    [Route("[controller]"), Route("api/[controller]")]
    public partial class AccountsController : Controller
    {
        private readonly IAccountService _accountService;
        private readonly GoogleOAuthProviderConfiguration _googleOAuthConfig;

        public AccountsController(IAccountService accountService, IOptions<GoogleOAuthProviderConfiguration> options)
        {
            _accountService = accountService;
            _googleOAuthConfig = options.Value;
        }

        [AllowAnonymous]
        [HttpPost("")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var token = await _accountService.Login(model.Email, model.Password);
            return Json(token);
        }

        /// <summary>
        /// Called when user register for the first time and again after email verification
        /// to set the password
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel model)
        {
            if (model == null || model.Email == null)
                return BadRequest();

            if (model.Password != null && model.Hash != null)
                await _accountService.ConfirmActivation(model.Email, model.Hash, model.Password);
            else if (model.FirstName != null)
                await _accountService.Register(model.Email, model.FirstName, model.LastName);
            else return BadRequest();

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("google")]
        public IActionResult GoogleLogin()
        {
            return Challenge("Google");
        }

        [HttpDelete("google")]
        public async Task<IActionResult> GoogleLogout()
        {
            await _accountService.Detach((User.Identity as IUserIdentity), OAuthProvider.Google);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("facebook")]
        public IActionResult FacebookLogin()
        {
            return Challenge("Facebook");
        }

        [HttpDelete("facebook")]
        public async Task<IActionResult> FacebookLogout()
        {
            await _accountService.Detach((User.Identity as IUserIdentity), OAuthProvider.Facebook);
            return Ok();
        }

        [HttpGet("disqus")]
        public async Task<IActionResult> DisqusLogin([FromServices] ICommentService commentService)
        {
            var token = await commentService.GenerateAuthenticationToken(User.Identity as IUserIdentity);
            return Json(token);
        }

        [AllowAnonymous]
        [Authorize(ActiveAuthenticationSchemes = "Google,Facebook")]
        [HttpGet("{provider}/callback")]
        public async Task<IActionResult> OAuthCallback([FromServices] IOptions<ContentConfiguration> contentConfig, [FromRoute] OAuthProvider provider)
        {
            var userIdentity = new UserIdentity(User);
            if (userIdentity.AuthenticationType != provider.GetName())
                return BadRequest("Authentication mistmached");

            var token = await _accountService.Login(userIdentity);

            var url = $"{Utility.CombineUrl(contentConfig.Value.Url, contentConfig.Value.OAuthCallbackPath)}?action=authenticate&token={Utility.UrlEncode(token.Token)}";
            return Redirect(url);
        }

        /// <summary>
        /// Authenticate and return the json
        /// </summary>
        /// <returns></returns>
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate()
        {
            var userIdentity = new UserIdentity(User);

            var token = await _accountService.Login(userIdentity);
            if (token != null)
                return Json(token);

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("authenticate/{provider}")]
        public async Task<IActionResult> AuthenticateOAuthToken(OAuthProvider authProvider, [FromBody] OAuthIdTokenModel model)
        {
            var identity = await _accountService.Exchange(authProvider, new AuthenticationToken { Token = model.FindToken() });
            var userToken = await _accountService.Login(identity);

            return Json(userToken);
        }
        
        [HttpPost("pwd")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordModel model)
        {
            var userIdentity = User.Identity as IUserIdentity;

            await _accountService.ChangePassword(userIdentity.Email, model.CurrentPassword, model.Password);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("pwd/reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] RegistrationModel model)
        {
            await _accountService.RequestPasswordReset(model.Email);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("username-check")]
        public async Task<IActionResult> CheckUsernameAvailability([FromBody] CheckUsernameModel model)
        {
            await _accountService.CheckUsernameAvailability(model.Email, model.Username);
            return Ok();
        }

        /// <summary>
        /// This is a bug after external login.
        /// Redirect to authenticate
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        // GET: /Account/AccessDenied
        [AllowAnonymous]
        [Authorize(ActiveAuthenticationSchemes = "Google,Facebook")]
        [HttpGet("~/Account/AccessDenied")]
        public IActionResult AccessDenied(string returnUrl = null)
        {
            // workaround
            if (Request.Cookies["Identity.External"] != null)
            {
                return RedirectToAction(nameof(OAuthCallback), new { provider = User?.Identity?.AuthenticationType });
            }
            return RedirectToAction(nameof(Login));
        }
    }
}