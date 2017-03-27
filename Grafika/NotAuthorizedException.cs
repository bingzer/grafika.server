using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika
{
    public class NotAuthorizedException : UserException
    {
        public NotAuthorizedException(string message = "Not Authorized", Exception inner = null)
            : base(message, inner)
        {
        }
    }
}
