using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Emails
{
    public abstract class EmailData : IEmailData
    {
        public string From { get; set; }
        public string To { get; set; }
        public ICollection<string> CCs { get; set; } = new List<string>();
        public ICollection<IEmailAttachment> Attachments { get; set; }
        public string Subject { get; set; }

        public abstract Task<string> GetContent(string type = ContentTypes.Html);
    }
}
