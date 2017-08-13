using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.WebSite.ViewModels
{
    public class CommentDisqusViewModel
    {
        [JsonProperty("shortname")]
        public string ShortName { get; set; }

        public string Url { get; set; }

        public string PostUrl { get; set; }

        public string Title { get; set; }

        public string Identifier { get; set; }

        public string Pub { get; set; }

        public string DisqusToken { get; set; }

        public string JwtToken { get; set; }

        public string TemplateName { get; set; } = "_DisqusComment";
    }
}
