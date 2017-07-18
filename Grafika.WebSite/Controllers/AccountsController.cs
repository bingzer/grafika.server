using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Accounts;
using Grafika.Utilities;
using Grafika.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
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

        [Route("/login"), AllowAnonymous]
        public IActionResult Login()
        {
            return View("Login");
        }
        
        [HttpPost, Route("login"), AllowAnonymous]
        public async Task<IActionResult> Authenticate(LoginModel model, string url = "/")
        {
            var authToken = await _service.Login(model.Email, model.Password);
            return await Authenticate(authToken.Token, url);
        }
        
        [HttpGet, Route("login/callback"), AllowAnonymous]
        public async Task<IActionResult> Authenticate(string token, string url = "/")
        {
            var principal = _tokenProvider.TokenHandler.ValidateToken(token, _tokenProvider.ValidationParameters, out var validatedToken);

            await HttpContext.Authentication.SignInAsync("cookie-auth", principal, new AuthenticationProperties { IsPersistent = true });
            url += $"?action=authenticate&token={token}";

            return Redirect(url);
        }

        [Route("logout")]
        public async Task<IActionResult> Logout(string url = "/")
        {
            await HttpContext.Authentication.SignOutAsync("cookie-auth");
            url += $"?action=deauthenticate";
            return Redirect(url);
        }

        [Route("login/form"), AllowAnonymous]
        public IActionResult LoginForm()
        {
            return PartialView("_LoginForm");
        }

        [Route("register/form"), AllowAnonymous]
        public IActionResult RegisterForm()
        {
            return PartialView("_Register");
        }
    }
}