using System;
using System.Net;

namespace Grafika.Web.ViewModels
{
    public class ErrorViewModel : PageViewModel
    {
        public HttpStatusCode StatusCode { get; set; }

        public override string Title { get; set; } = "Uh oh! Something is wrong";
        public override string Description { get; set; } = "Something is very very wrong!";
        public string Detail { get; set; }

        /// <summary>
        /// Maybe null
        /// </summary>
        public Exception Exception { get; set; }
    }
}
