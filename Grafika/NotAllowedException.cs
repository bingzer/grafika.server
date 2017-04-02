using System;

namespace Grafika
{
    public class NotAllowedException : UserException
    {
        public NotAllowedException(string message = "Not Allowed", Exception inner = null)
            : base(message, inner)
        {
        }
    }
}
