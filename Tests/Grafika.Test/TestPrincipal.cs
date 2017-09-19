using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace Grafika.Test
{
    public class TestPrincipal : ClaimsPrincipal
    {
        private readonly TestIdentity _identity;

        public TestPrincipal(TestIdentity testIdentity)
            : base(testIdentity)
        {
            _identity = testIdentity;
        }

        public override IIdentity Identity => _identity;
    }
}
