using System.Collections.Generic;
using System.Threading.Tasks;
using Grafika.Animations;
using System;
using Grafika.Utilities;

namespace Grafika.Services.Animations
{
    public class AnimationService : EntityService<Animation, AnimationQueryOptions, IAnimationRepository>, IAnimationService
    {
        public AnimationService(IServiceContext serviceContext, IAnimationRepository repo, IAnimationValidator validator)
            : base(serviceContext, repo, validator)
        {
        }

        public override async Task<Animation> Delete(string entityId)
        {
            var animation = await GetById(entityId);

            animation.IsRemoved = true;
            animation.DateModified = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            Validator.Validate(animation);

            return await Repository.Update(animation);
        }

        public async Task Delete(IEnumerable<string> animationIds)
        {
            // TODO: Check permission for User
            //       Only allows by System user
            await Repository.RemoveByIds(animationIds);
        }

        public async Task IncrementViewCount(string animationId)
        {
            var animation = await GetById(animationId);

            animation.Views++;
            await Repository.Update(animation);
        }

        public async Task SubmitRating(string animationId, int rating)
        {
            var animation = await GetById(animationId);

            if (rating <= 0 && rating >= 5)
                throw new NotValidException("rating is not valid");

            animation.Rating = double.Parse(((animation.Rating + rating) / 2).Value.ToString("0.00"));
            await Repository.Update(animation);
        }

        protected internal override AnimationQueryOptions PrepareQueryOptions(AnimationQueryOptions options)
        {
            if (Validator.ValidateId(options.Term))
            {
                options.Id = options.Term;
                options.Term = null;
                options.IsRemoved = null;
                options.IsPublic = null;
            }

            return options;
        }

        protected internal override async Task<Animation> PrepareEntityForCreate(Animation source)
        {
            var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var userService = Context.ServiceProvider.Get<IUserService>();
            var user = await userService.Get(User.Id);

            if (user == null)
                throw new NotAuthorizedException();

            source.Id = null;
            source.UserId = User.Id;
            source.Type = EntityType.Animation;
            source.IsRemoved = false;
            source.Rating = 5;
            source.Views = 0;
            if (source.IsPublic == null)
                source.IsPublic = user.Prefs.DrawingIsPublic ?? true;
            if (source.DateCreated == null)
                source.DateCreated = now;
            if (source.DateModified == null)
                source.DateModified = now;
            if (source.Author == null)
                source.Author = user.Prefs.DrawingAuthor ?? user.Username;
            if (source.TotalFrame == null)
                source.TotalFrame = 0;
            if (source.Timer == null)
                source.Timer = user.Prefs.DrawingTimer ?? 500;

            return source;
        }

        protected internal override async Task<Animation> CreateEntityForUpdate(Animation source)
        {
            if (!await Repository.Any(new AnimationQueryOptions { Id = source.Id, UserId = User.Id }))
                throw new NotAuthorizedException();

            // only update some fields
            return new Animation
            {
                Id = source.Id,
                LocalId = source.LocalId,
                Author = source.Author,
                Category = source.Category,
                Client = source.Client,
                // DateCreated = source.
                //DateModified = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                DateModified = source.DateModified,
                Description = source.Description,
                Height = source.Height,
                IsPublic = source.IsPublic,
                Name = source.Name,
                Timer = source.Timer,
                TotalFrame = source.TotalFrame,
                UserId = source.UserId,
                Resources = source.Resources,
                // UserId = NEVER
                Width = source.Width
            };
        }
    }
}
