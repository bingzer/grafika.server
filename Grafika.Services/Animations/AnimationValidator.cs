using Grafika.Animations;

namespace Grafika.Services.Animations
{
    public class AnimationValidator : EntityValidator<Animation>, IAnimationValidator
    {
        public AnimationValidator(IEntityIdValidator entityIdValidator) 
            : base(entityIdValidator)
        {
        }

        public override void Sanitize(Animation entity, IUser caller = null)
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
