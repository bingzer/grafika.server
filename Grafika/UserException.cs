using System;

namespace Grafika
{
    /// <summary>
    /// Friendly user message
    /// </summary>
    public class UserException : Exception
    {
        public const string DefaultErrorMessage = "Fatal Error has occured";

        public UserException(string message = DefaultErrorMessage, Exception innerException = null)
            : base(message, innerException)
        {

        }
    }
}
