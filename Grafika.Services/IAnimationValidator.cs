using Grafika.Animations;

namespace Grafika.Services
{
    public interface IAnimationValidator : IEntityValidator<Animation>
    {
        ///// <summary>
        ///// Verify access to the animation by the accessor.
        ///// </summary>
        ///// <param name="animation"></param>
        ///// <param name="accessor"></param>
        ///// <exception cref="AnimationAccessException">When access is denied</exception>
        //void VerifyAccess(Animation animation, IUser accessor);
    }
}
