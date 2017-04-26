﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Grafika.Animations;
using System;

namespace Grafika.Services.Animations
{
    public class AnimationService : EntityService<Animation, AnimationQueryOptions, IAnimationRepository>, IAnimationService
    {
        public AnimationService(IServiceContext userContext, IAnimationRepository repo, IAnimationValidator validator)
            : base(userContext, repo, validator)
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

        public Task<Animation> PrepareNewAnimation(Animation animation, User user)
        {
            var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            animation.UserId = user.Id;
            animation.Type = "Animation";
            animation.IsRemoved = false;
            animation.Rating = 5;
            animation.Views = 0;
            if (animation.IsPublic == null)
                animation.IsPublic = user.Prefs.DrawingIsPublic ?? true;
            if (animation.DateCreated == null)
                animation.DateCreated = now;
            if (animation.DateModified == null)
                animation.DateModified = now;
            if (animation.Author == null)
                animation.Author = user.Prefs.DrawingAuthor ?? user.Username;
            if (animation.TotalFrame == null)
                animation.TotalFrame = 0;
            if (animation.Timer == null)
                animation.Timer = user.Prefs.DrawingTimer ?? 500;

            return Task.FromResult(animation);
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
