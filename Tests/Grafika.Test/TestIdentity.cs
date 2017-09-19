using System;
using System.Collections.Generic;
using System.Text;

namespace Grafika.Test
{
    public class TestIdentity : User, IUserIdentity
    {
        public string AuthenticationType => "TestAuthentication";

        public bool IsAuthenticated => true;

        public string Name => Email;

        public TestIdentity()
        {
            Prefs = new UserPreference();
        }
    }
}
