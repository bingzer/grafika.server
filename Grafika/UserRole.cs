using System.Collections.Generic;

namespace Grafika
{
    public class UserRole
    {
        public User User { get; set; }
        public IEnumerable<string> Roles
        {
            get { return User.Roles; }
        }
    }
}
