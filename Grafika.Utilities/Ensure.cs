using System;
using System.Collections.Generic;
using System.Linq;

namespace Grafika.Utilities
{
    public static class Ensure
    {
        /// <summary>
        /// Ensure not null
        /// </summary>
        /// <param name="value"></param>
        /// <param name="message"></param>
        public static void NotNull(object value, string message = null)
        {
            if (value != null) return;

            throw new NullReferenceException(message);
        }

        public static void NotNullOrEmpty<TAny>(IEnumerable<TAny> value, string message = null)
        {
            NotNull(value, message);
            if (!value.Any())
                throw new ArgumentException("Empty. " + message);
        }

        /// <summary>
        /// Checks an argument to ensure it isn't null.
        /// </summary>
        /// <param name = "value">The argument value to check</param>
        /// <param name = "name">The name of the argument</param>
        public static void ArgumentNotNull(object value, string name)
        {
            if (value != null) return;

            throw new ArgumentNullException(name);
        }

        /// <summary>
        /// Checks a string argument to ensure it isn't null or empty.
        /// </summary>
        /// <param name = "value">The argument value to check</param>
        /// <param name = "name">The name of the argument</param>
        public static void ArgumentNotNullOrEmptyString(string value, string name)
        {
            ArgumentNotNull(value, name);
            if (!string.IsNullOrWhiteSpace(value)) return;

            throw new ArgumentException("String cannot be empty", name);
        }

        /// <summary>
        /// Checks a timespan argument to ensure it is a positive value.
        /// </summary>
        /// <param name = "value">The argument value to check</param>
        /// <param name = "name">The name of the argument</param>
        public static void GreaterThanZero(TimeSpan value, string name)
        {
            ArgumentNotNull(value, name);

            if (value.TotalMilliseconds > 0) return;

            throw new ArgumentException("Timespan must be greater than zero", name);
        }
    }
}
