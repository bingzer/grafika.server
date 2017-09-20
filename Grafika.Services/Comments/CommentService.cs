using System;
using System.Threading.Tasks;
using Grafika.Animations;
using Grafika.Services.Comments;

namespace Grafika.Services.Disqus
{
    class CommentService : Service, ICommentService
    {
        private readonly IAccountService _accountService;
        private readonly ICommentProvider _provider;

        public CommentService(IServiceContext serviceContext, 
            IAccountService accountService,
            ICommentProvider provider) 
            : base(serviceContext)
        {
            _accountService = accountService;
            _provider = provider;
        }

        public Task<AuthenticationToken> GenerateAuthenticationToken(IUser user)
        {
            if (user == null)
                return Task.FromResult(AuthenticationToken.Empty);
            return _provider.GenerateAuthenticationToken(user);
        }

        public async Task<Uri> GenerateRemoteUrl(Animation animation, User user = null)
        {
            var context = new AnimationCommentAuthenticationContext(animation)
            {
                User = user,
                ServerUrl = Context.ServerUrl.ToString(),
                UserToken = user == null ? AuthenticationToken.Empty : await _accountService.GenerateUserToken(user)
            };
            return await _provider.GetCommentUrl(context);
        }
    }
}
