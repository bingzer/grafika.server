using Grafika.Animations;
using Grafika.Services.Extensions;
using Grafika.Utilities;
using System;

namespace Grafika.Services.Comments
{
    public class CommentAuthenticationContext : ICommentAuthenticationContext
    {
        public virtual string Id { get; set; }
        public virtual string Title { get; set; }
        public virtual string ServerUrl { get; set; }
        public virtual string Url { get; set; }
        public virtual string PostUrl { get; set; }
        public virtual User User { get; set; }
        public virtual AuthenticationToken UserToken { get; set; }
    }

    public class AnimationCommentAuthenticationContext : CommentAuthenticationContext
    {
        private readonly Animation _animation;

        public AnimationCommentAuthenticationContext(Animation animation)
        {
            _animation = animation;
        }

        public override string Id => _animation.Id;
        public override string Title => _animation.Name;
        public override string Url => _animation.GetUrl();
        public override string PostUrl => Utility.CombineUrl(_animation.GetApiUrl(), "comments");
    }
}
