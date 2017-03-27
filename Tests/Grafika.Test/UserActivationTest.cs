using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test
{
    public class UserActivationTest
    {
        [Fact]
        public void TestIsExpired()
        {
            var activation = new UserActivation();

            activation.Timestamp = DateTime.UtcNow;
            Assert.Equal(false, activation.IsExpired(TimeSpan.FromMinutes(1)));

            activation.Timestamp = DateTime.UtcNow.AddHours(-1);
            Assert.Equal(true, activation.IsExpired(TimeSpan.FromMinutes(1)));
        }

        [Fact]
        public void IsActivationValid()
        {
            var activation = new UserActivation
            {
                Hash = "123",
                Timestamp = DateTime.UtcNow.AddMinutes(-5) // 5 mins ago
            };

            Assert.Equal(true, activation.IsActivationValid("123", TimeSpan.FromMinutes(10)));
            Assert.Equal(false, activation.IsActivationValid("1234", TimeSpan.FromMinutes(10)));
            Assert.Equal(false, activation.IsActivationValid("123", TimeSpan.FromMinutes(2)));
        }
    }
}
