using System.Threading.Tasks;
using Grafika.Services.Emails;
using Grafika.Services.Models;
using Grafika.Utilities;

namespace Grafika.Services.Animations
{
    class AnimationEmailService : TemplatedEmailService, IAnimationEmailService
    {
        private readonly IAnimationService _animationService;
        private readonly IUserService _userService;

        public AnimationEmailService(IServiceContext userContext, 
            IAnimationService animationService,
            IUserService userService) 
            : base(userContext)
        {
            _animationService = animationService;
            _userService = userService;
        }

        public async Task SendAnimationCommentEmail(string animationId)
        {
            var animation = await _animationService.Get(animationId);
            if (animation == null)
                throw new NotFoundExeption();

            var owner = await _userService.Get(animation.UserId);
            if (owner == null)
                throw new NotFoundExeption();

            if (owner.Subscriptions.EmailOnComments == true)
            {
                var model = CreateModel<AnimationCommentEmail>(owner.Email, "New comment on " + animation.Name);
                model.Link = Utility.CombineUrl(ContentConfig.Url, "animations", animation.Id);

                await SendEmail(model);
            }
        }
    }
}
