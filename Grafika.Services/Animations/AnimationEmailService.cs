using System.Threading.Tasks;
using Grafika.Services.Emails;
using Grafika.Services.Models;
using Grafika.Utilities;
using Grafika.Animations;

namespace Grafika.Services.Animations
{
    class AnimationEmailService : TemplatedEmailService, IAnimationEmailService
    {
        private readonly IAnimationService _animationService;
        private readonly IUserRepository _userRepository;
        private readonly IAwsResourceRepository _awsRepository;

        public AnimationEmailService(IServiceContext userContext, 
            IAnimationService animationService,
            IUserRepository userRepository,
            IAwsResourceRepository awsRepository)
            : base(userContext)
        {
            _animationService = animationService;
            _userRepository = userRepository;
            _awsRepository = awsRepository;
        }

        public async Task SendAnimationCommentEmail(string animationId, IComment userComment)
        {
            var animation = await _animationService.Get(animationId);
            if (animation == null)
                throw new NotFoundExeption();

            var owner = await _userRepository.First(new UserQueryOptions { Id = animation.UserId });
            if (owner == null)
                throw new NotFoundExeption();

            if (owner.Subscriptions.EmailOnComments == true)
            {
                var model = CreateModel<AnimationCommentEmail>(owner.Email, "New comment on " + animation.Name);
                model.CommentUser = User != null ? User.Username : Grafika.User.Anonymous;
                model.Comment = userComment.Text;
                model.ThumbnailUrl = await _awsRepository.GetResourceUrl(EntityType.Animation, animationId, Thumbnail.ResourceId);
                model.Link = Utility.CombineUrl(ServerConfig.Url, "animations", animation.Id);

                await SendEmail(model);
            }
        }
    }
}
