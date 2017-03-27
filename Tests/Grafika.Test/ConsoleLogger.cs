using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Test
{
    class ConsoleLogger<T> : ConsoleLogger, ILogger<T>
    {

    }

    class ConsoleLogger : ILogger, IDisposable
    {
        public IDisposable BeginScope<TState>(TState state)
        {
            return this;
        }

        public void Dispose()
        {
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            Console.WriteLine("> " + formatter(state, exception));
        }
    }
}
