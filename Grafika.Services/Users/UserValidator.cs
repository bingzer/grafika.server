namespace Grafika.Services.Users
{
    public class UserValidator : EntityValidator<User>, IUserValidator
    {
        public UserValidator(IEntityIdValidator entityIdValidator) 
            : base(entityIdValidator)
        {
        }

        public override void Sanitize(User entity, IUser caller = null)
        {
            // password should always be null
            if (entity.Local != null)
                entity.Local.Password = null;

            if (caller.IsAdmin() || caller.IsSystem())
                return;

            // if caller is different person
            if (caller?.Id != entity.Id)
            {
                entity.Email = null;
                entity.Google = null;
                entity.Facebook = null;
                entity.Prefs = null;
                entity.Roles = null;
                entity.Local = null;
                entity.Subscriptions = null; // other use doesn't need to know about this
            }

            entity.Activation = null;
            entity.Stats = null;
        }
    }
}
