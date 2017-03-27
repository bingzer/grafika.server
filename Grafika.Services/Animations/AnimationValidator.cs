using Grafika.Animations;

namespace Grafika.Services.Animations
{
    public class AnimationValidator : Validator<Animation>, IAnimationValidator
    {
        public void Sanitize(Animation entity, IUser caller = null)
        {
            if (entity == null || entity.IsPublic.Value) return;
            if (caller != null)
            {
                if (entity.UserId == caller?.Id) return;
                if (caller?.IsAdmin() == true || caller?.IsSystem() == true) return;
            }

            throw new NotAuthorizedException();
        }
    }
}
