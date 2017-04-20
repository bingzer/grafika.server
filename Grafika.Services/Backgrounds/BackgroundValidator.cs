using Grafika.Animations;

namespace Grafika.Services.Backgrounds
{
    class BackgroundValidator : Validator<Background>, IBackgroundValidator
    {
        public void Sanitize(Background entity, IUser caller = null)
        {
            if (caller?.IsAdmin() == true || caller?.IsSystem() == true) return;

            if (entity?.IsRemoved == false)
            {
                if (entity?.IsPublic == true) return;
                if (entity?.UserId == caller?.Id) return;
            }

            throw new NotAuthorizedException();
        }
    }
}
