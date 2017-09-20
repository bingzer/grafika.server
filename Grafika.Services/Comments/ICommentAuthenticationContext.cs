using Grafika.Animations;
using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Services.Comments
{
    public interface ICommentAuthenticationContext
    {
        /// <summary>
        /// Super unique Id
        /// </summary>
        string Id { get; }

        /// <summary>
        /// Title for the page (required)
        /// </summary>
        string Title { get; }

        /// <summary>
        /// Server Url (i.e: https://grafika.herokuapp.com)
        /// </summary>
        string ServerUrl { get; }

        /// <summary>
        /// Absolute Uri where this page is (i.e: the animation detail page, etc...)
        /// </summary>
        string Url { get; }

        /// <summary>
        /// Callback uri after user post a comment (maybe null)
        /// </summary>
        string PostUrl { get; }

        /// <summary>
        /// The user that makes this call (maybe null)
        /// </summary>
        User User { get; }

        /// <summary>
        /// Authentication token for the user, also maybe null
        /// </summary>
        AuthenticationToken UserToken { get; set; }
    }
}
