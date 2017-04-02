using Grafika.Services;
using Grafika.Services.Emails;
using Grafika.Utilities;
using Grafika.Web.Models;
using Microsoft.AspNetCore.Builder;

namespace Grafika.Web.Extensions
{
    public static class ScratchExtensions
    {
        public static async void UseScratch(this IApplicationBuilder app)
        {
            var serviceProvider = app.ApplicationServices;
            var emailService = serviceProvider.Get<IEmailService>();
            var engine = serviceProvider.Get<ITemplatedRenderingEngine<string>>();

            var loginModel = new LoginModel { Email = "My Username", Password = "My Provider" };
            var emailData = new TemplatedEmailData<LoginModel>(engine, "TestEmail", loginModel)
            {
                To = "ricky@bingzer.com",
                Subject = "Test Template Email"
            };

            await emailService.SendEmail(emailData);

        }
    }
}
