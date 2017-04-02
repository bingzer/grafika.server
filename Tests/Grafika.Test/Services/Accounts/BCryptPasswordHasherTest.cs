using Grafika.Services.Accounts;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Accounts
{
    public class BCryptPasswordHasherTest
    {
        [Fact]
        public void TestHashPassword()
        {
            var user = new User();
            var hasher = new BCryptPasswordHasher();

            var hashedPassword = hasher.HashPassword(user, "ASxtvuSE");
            Assert.NotNull(hashedPassword);
            Assert.NotEmpty(hashedPassword);
        }

        [Fact]
        public void TestVerifyPassword()
        {
            var user = new User();
            var hasher = new BCryptPasswordHasher();

            var hashedPassword = hasher.HashPassword(user, "utCFTuj6");
            var result = hasher.VerifyHashedPassword(user, hashedPassword, "utCFTuj6");
            Assert.Equal(PasswordVerificationResult.Success, result);

            result = hasher.VerifyHashedPassword(user, hashedPassword, "dEM8zcvh");
            Assert.Equal(PasswordVerificationResult.Failed, result);
        }
    }
}
