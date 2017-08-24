using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Accounts;
using Grafika.Utilities;
using Grafika.WebSite.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Grafika.WebSite.Controllers
{
    [Route("accounts")]
    public class AccountsController : Controller
    {
        private readonly IAccountService _service;
        private readonly AccountTokenProvider _tokenProvider;

        public AccountsController(IAccountService service, AccountTokenProvider tokenProvider)
        {
            _service = service;
            _tokenProvider = tokenProvider;
        }

        [HttpGet, Route("/me"), Route("profile")]
        public async Task<IActionResult> Profile([FromServices] IUserService userService)
        {
            var userIdentity = User.Identity as IUserIdentity;
            var user = await userService.Get(userIdentity.Id);
            ViewBag.Page = new PageViewModel
            {
                Title = $"{userIdentity.Name} | Grafika",
                Description = $"Account profile page for {userIdentity.Name}"
            };

            var model = new AccountProfileViewModel
            {
                User = user,
                ApiSaveProfileUrl = Utility.CombineUrl(AppEnvironment.Default.Server.Url, $"/users/{user.Id}"),
                ApiPasswordUrl = Utility.CombineUrl(AppEnvironment.Default.Server.Url, "/accounts/pwd")
            };

            return View("Profile", model);
        }

        [Route("verify"), AllowAnonymous]
        public IActionResult Verify([FromQuery] RerouteViewModel model)
        {
            if (string.IsNullOrEmpty(model?.Hash))
                return Redirect("/");

            ViewBag.ApiPasswordUrl = Utility.CombineUrl(AppEnvironment.Default.Server.Url, "/accounts/register");
            ViewBag.Page = new PageViewModel
            {
                Title = "Welcome | Grafika"
            };

            return View(model);
        }

        [Route("reset"), AllowAnonymous]
        public IActionResult Reset([FromQuery] RerouteViewModel model)
        {
            if (string.IsNullOrEmpty(model?.Hash))
                return Redirect("/");

            ViewBag.ApiPasswordUrl = Utility.CombineUrl(AppEnvironment.Default.Server.Url, "/accounts/register");
            ViewBag.Page = new PageViewModel
            {
                Title = "Reset Password | Grafika"
            };

            return View(model);
        }

        [Route("/signin"), AllowAnonymous]
        public IActionResult Login()
        {
            if (User.Identity?.IsAuthenticated == true)
                return Redirect("/");

            ViewBag.Page = new PageViewModel
            {
                Title = "Sign In | Grafika"
            };

            return View("SignIn");
        }

        [Route("/signup"), AllowAnonymous]
        public IActionResult Register()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Sign Up | Grafika"
            };
            ViewBag.IsRegistration = true;

            return View("SignUp");
        }

        [Route("/signout"), Route("/logout")]
        public async Task<IActionResult> Logout(string url = "/")
        {
            await HttpContext.Authentication.SignOutAsync("cookie-auth");
            url += $"?action=deauthenticate";
            return Redirect(url);
        }
        
        [HttpGet, Route("login/callback"), AllowAnonymous]
        public async Task<IActionResult> Authenticate(string token, string url = "/")
        {
            var principal = _tokenProvider.TokenHandler.ValidateToken(token, _tokenProvider.ValidationParameters, out var validatedToken);

            await HttpContext.Authentication.SignInAsync("cookie-auth", principal, new AuthenticationProperties { IsPersistent = true });
            url += $"?action=authenticate&token={token}";

            return Redirect(url);
        }

        [Route("password"), AllowAnonymous]
        public IActionResult SetPassword(PasswordFormViewModel model)
        {
            ViewBag.ApiPasswordUrl = Utility.CombineUrl(AppEnvironment.Default.Server.Url, "/accounts/pwd");
            return PartialView("_SetPassword", model);
        }

        [Route("recovery"), AllowAnonymous]
        public IActionResult Recovery()
        {
            ViewBag.ApiRecoveryUrl = Utility.CombineUrl(AppEnvironment.Default.Server.Url, "/accounts/pwd/reset");
            return PartialView("_Recovery");
        }

        [Route("forms/password"), AllowAnonymous]
        public IActionResult GetPasswordForm(PasswordFormViewModel model)
        {
            return PartialView("_PasswordForm", model);
        }

        [Route("forms/signin"), AllowAnonymous]
        public IActionResult SignInDialog()
        {
            return PartialView("_SignInDialogForm");
        }
    }
}