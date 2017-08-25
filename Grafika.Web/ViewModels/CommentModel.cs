using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.Web.Models
{
    public class CommentModel : IComment
    {
        public string Id { get; set; }
        public string Text { get; set; }
    }
}
