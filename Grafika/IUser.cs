using System.Collections.Generic;

namespace Grafika
{
    public interface IUser : IEntity
    {
        string Email { get; }
        string Username { get; }
        string FirstName { get; }
        string LastName { get; }
        
        bool? IsActive { get; }
        long? DateCreated { get; }
        long? DateModified { get; }

        IEnumerable<string> Roles { get; }
    }
}
