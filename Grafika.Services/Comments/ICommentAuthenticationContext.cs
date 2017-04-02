using Grafika.Animations;
using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Services.Comments
{
    interface ICommentAuthenticationContext
    {
        Uri ServerUrl { get; set; }
        Animation Animation { get; set; }
        User User { get; set; }
        AuthenticationToken UserToken { get; set; }
    }
}
