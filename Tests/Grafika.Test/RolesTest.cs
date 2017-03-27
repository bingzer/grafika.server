using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test
{
    public class RolesTest
    {
        [Fact]
        public void TestIsAdmin()
        {
            var user = new User();
            user.Roles = new List<string>();
            ((ICollection<string>)user.Roles).Add(Roles.Developer);
            ((ICollection<string>)user.Roles).Add(Roles.User);
            ((ICollection<string>)user.Roles).Add(Roles.Administrator);

            Assert.Equal(true, Roles.IsAdmin(user));


            user = new User();
            user.Roles = new List<string>();
            ((ICollection<string>)user.Roles).Add(Roles.User);
            Assert.Equal(false, Roles.IsAdmin(user));
        }

        [Fact]
        public void TestIsSystem()
        {
            var user = new User();
            user.Roles = new List<string>();
            ((ICollection<string>)user.Roles).Add(Roles.System);
            ((ICollection<string>)user.Roles).Add(Roles.User);
            ((ICollection<string>)user.Roles).Add(Roles.Administrator);

            Assert.Equal(true, Roles.IsSystem(user));


            user = new User();
            user.Roles = new List<string>();
            ((ICollection<string>)user.Roles).Add(Roles.Administrator);
            Assert.Equal(false, Roles.IsSystem(user));
        }
    }
}
