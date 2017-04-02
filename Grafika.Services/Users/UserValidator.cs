namespace Grafika.Services.Users
{
    public class UserValidator : Validator<User>, IUserValidator
    {
        public void Sanitize(User entity, IUser caller = null)
        {
            // password should always be null
            if (entity.Local != null)
                entity.Local.Password = null;

            if (caller.IsAdmin() || caller.IsSystem())
                return;

            if (caller?.Id != entity.Id)
                entity.Email = null;

            entity.Activation = null;
            entity.Stats = null;
        }
    }
}
