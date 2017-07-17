using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Accounts;
using Grafika.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
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

        [Route("login"), AllowAnonymous]
        public IActionResult Login()
        {
            return View("Login");
        }

        [HttpPost, Route("login"), AllowAnonymous]
        public async Task<IActionResult> LoginPost(string email, string password, string url = "/")
        {
            var authToken = await _service.Login(email, password);
            var principal = _tokenProvider.TokenHandler.ValidateToken(authToken.Token, _tokenProvider.ValidationParameters, out var validatedToken);

            await HttpContext.Authentication.SignInAsync("cookie-auth", principal, new AuthenticationProperties { IsPersistent = true });
            return Redirect(url);
        }

        [Route("login/form"), AllowAnonymous]
        public IActionResult LoginForm()
        {
            return PartialView("_Login");
        }

        [Route("register"), AllowAnonymous]
        public IActionResult Register()
        {
            return PartialView("_Register");
        }

        [Route("logout")]
        public async Task<IActionResult> Logout(string url = "/")
        {
            await HttpContext.Authentication.SignOutAsync("cookie-auth");
            return Redirect(url);
        }
    }
}