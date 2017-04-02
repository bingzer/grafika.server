using Grafika.Emails;
using Grafika.Utilities;
using MimeKit;
using System.Threading.Tasks;

namespace Grafika.Services.Emails
{
    internal static class EmailDataUtils
    {
        internal static async Task<MimeMessage> GenerateMimeMessage(this IEmailData data)
        {
            Ensure.ArgumentNotNull(data, "data");

            var mimeMessage = new MimeMessage();
            mimeMessage.From.Add(new MailboxAddress(data.From));
            mimeMessage.To.Add(new MailboxAddress(data.To));
            mimeMessage.Subject = data.Subject;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = await data.GetContent();
            bodyBuilder.TextBody = await data.GetContent(ContentTypes.Text);
            mimeMessage.Body = bodyBuilder.ToMessageBody();

            return mimeMessage;
        }
    }
}
