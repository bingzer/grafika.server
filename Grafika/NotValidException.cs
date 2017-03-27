using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Grafika
{
    public class NotValidException : UserException
    {
        public NotValidException(string message = "Not Valid", Exception inner = null)
            : base(message, null)
        {
        }

        public NotValidException(IEnumerable<ValidationResult> results)
            : base(string.Join("\n", results.Select(r => r.ErrorMessage)))
        {
        }
    }
}
