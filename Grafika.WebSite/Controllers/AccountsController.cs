using Grafika.Configurations;
using Grafika.Services;
using Grafika.Services.Accounts;
using Grafika.Utilities;
using Grafika.Web.Models;
using Grafika.WebSite.ViewModels;
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

        [Route("/signin"), AllowAnonymous]
        public IActionResult Login()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Login to Grafika",
                UseFooter = false
            };

            return View("SignIn");
        }

        [Route("/signup"), AllowAnonymous]
        public IActionResult Register()
        {
            ViewBag.Page = new PageViewModel
            {
                Title = "Sign Up - Grafika",
                UseFooter = false
            };
            ViewBag.IsRegistration = true;

            return View("SignUp");
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

        [Route("forms/login"), AllowAnonymous]
        public IActionResult LoginForm()
        {
            return PartialView("_LoginForm");
        }

        [Route("forms/registration"), AllowAnonymous]
        public IActionResult RegistrationForm()
        {
            return PartialView("_RegistrationForm");
        }

        [Route("recovery"), AllowAnonymous]
        public IActionResult ForgetPassword()
        {
            return PartialView("_ForgetPassword");
        }
    }
}