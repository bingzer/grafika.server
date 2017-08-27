using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika
{
    public class NotExpectedException : UserException
    {
        public NotExpectedException(string message = "Not Expected", Exception inner = null)
            : base(message, inner)
        {
        }
    }
}
