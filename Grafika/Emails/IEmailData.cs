using System.Collections.Generic;
using System.Threading.Tasks;

namespace Grafika.Emails
{
    public interface IEmailData
    {
        string From { get; set; }
        string To { get; set; }
        ICollection<string> CCs { get; set; }
        ICollection<IEmailAttachment> Attachments { get; set; }

        string Subject { get; set; }
        Task<string> GetContent(string type = "text/html");
    }

    public interface IEmailAttachment
    {

    }
}
