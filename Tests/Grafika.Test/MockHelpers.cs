using Grafika.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;

namespace Grafika.Test
{
    static class MockHelpers
    {
        public static Mock<IServiceProvider> ServiceProvider
        {
            get
            {
                var mock = new Mock<IServiceProvider>();
                mock.Setup(c => c.GetService(It.Is<Type>((type) => type == typeof(ILoggerFactory))))
                    .Returns(() => LoggerFactory.Object);

                return mock;
            }
        }

        public static Mock<ILoggerFactory> LoggerFactory
        {
            get
            {
                var mock = new Mock<ILoggerFactory>();
                mock.Setup(c => c.CreateLogger(It.IsAny<string>())).Returns(() => new ConsoleLogger());

                return mock;
            }
        }

        public static Mock<IHttpContextAccessor> HttpContextAccessor
        {
            get
            {
                var mock = new Mock<IHttpContextAccessor>();
                return mock;
            }
        }

        public static Mock<IServiceContext> ServiceContext
        {
            get
            {
                var mock = new Mock<IServiceContext>();
                return mock;
            }
        }

        public static Mock<IOptions<TConfiguration>> Configure<TConfiguration>(TConfiguration value = null)
            where TConfiguration : class, new()
        {
            var mock = new Mock<IOptions<TConfiguration>>();
            if (value == null)
                mock.Setup(c => c.Value).Returns(new TConfiguration());
            else mock.Setup(c => c.Value).Returns(value);
            return mock;
        }

    }
}
