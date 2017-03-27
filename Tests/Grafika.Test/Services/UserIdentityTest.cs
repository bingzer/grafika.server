using Grafika.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using Xunit;

namespace Grafika.Test.Services
{
    public class UserIdentityTest
    {
        [Fact]
        public void TestCotr()
        {
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim("id", "Id"));
            claims.AddClaim(new Claim("email", "Email"));
            claims.AddClaim(new Claim("username", "Username"));
            claims.AddClaim(new Claim("firstName", "FirstName"));
            claims.AddClaim(new Claim("family_name", "LastName"));
            claims.AddClaim(new Claim("isActive", "true"));
            claims.AddClaim(new Claim(ClaimTypes.Role, "user"));
            claims.AddClaim(new Claim(ClaimTypes.Role, "administrator"));

            var userIdentity = new UserIdentity(claims);
            Assert.Equal("Id", userIdentity.Id);
            Assert.Equal("Email", userIdentity.Email);
            Assert.Equal("Username", userIdentity.Username);
            Assert.Equal("FirstName", userIdentity.FirstName);
            Assert.Equal("LastName", userIdentity.LastName);
            Assert.Equal(true, userIdentity.IsActive);
            Assert.True(userIdentity.IsAdmin());
        }
    }
}
