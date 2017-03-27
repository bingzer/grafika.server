using Grafika.Emails;
using Grafika.Services.Emails;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Grafika.Test.Services.Emails
{
    public class EmailDataUtilsTest
    {
        [Fact]
        public async void TestGenerateMimeMessage_Null()
        {
            await Assert.ThrowsAsync<ArgumentNullException>(() => EmailDataUtils.GenerateMimeMessage(null));
        }

        [Fact]
        public async void TestGenerateMimeMessage()
        {
            var emailData = new TestingEmailData
            {
                To = "to@email.com",
                From = "from@email.com",
                Subject = "Subject"
            };

            var message = await EmailDataUtils.GenerateMimeMessage(emailData);
            Assert.Equal("to@email.com", ((MailboxAddress)message.To[0]).Address);
            Assert.Equal("from@email.com", ((MailboxAddress)message.From[0]).Address);
            Assert.Equal("Subject", message.Subject);
            Assert.Equal("text/html", message.HtmlBody);
            Assert.Equal("text/plain", message.TextBody);
        }

        class TestingEmailData : EmailData
        {
            public override Task<string> GetContent(string type = "text/html")
            {
                return Task.FromResult(type);
            }
        }
    }
}
