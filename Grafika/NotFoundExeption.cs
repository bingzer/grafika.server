using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika
{
    public class NotFoundExeption : UserException
    {
        public NotFoundExeption(string message = "Not Found", Exception inner = null)
            : base(message, inner)
        {

        }
    }
}
