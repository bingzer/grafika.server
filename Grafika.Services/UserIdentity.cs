using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Linq;
using Grafika.Utilities;

namespace Grafika.Services
{
    public class UserIdentity : ClaimsIdentity, IUserIdentity
    {
        public UserIdentity(ClaimsPrincipal principal)
            : base(principal.Identity as ClaimsIdentity)
        {
        }

        public UserIdentity(ClaimsIdentity identity)
            : base(identity)
        {
            Ensure.ArgumentNotNull(identity, "identity");
        }

        public string Id => FindClaimsValue("id", "_id", ClaimTypes.NameIdentifier, ClaimTypes.Sid);

        public string Email => FindClaimsValue("email", ClaimTypes.Email);

        public string Username => FindClaimsValue("username");

        public string FirstName => FindClaimsValue("firstName", ClaimTypes.GivenName);

        public string LastName => FindClaimsValue("lastName", "family_name", ClaimTypes.Surname);

        public bool? IsActive => bool.Parse(FindClaimsValue("active", "isActive")??"true");

        public long? DateCreated => long.Parse(FindClaimsValue("dateCreated") ?? DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString());

        public long? DateModified => long.Parse(FindClaimsValue("dateModified") ?? DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString());

        public IEnumerable<string> Roles => FindAll(c => c.Type == ClaimTypes.Role).Select(c => c.Value);

        private string FindClaimsValue(string type, params string[] otherTypes)
        {
            var list = new List<string> { type };
            list.AddRange(otherTypes);

            foreach (var claimType in list)
            {
                var claim = Claims.FirstOrDefault(c => c.Type.EqualsIgnoreCase(claimType));
                if (claim != null)
                    return claim.Value;
            }

            return null;
        }
    }
}
