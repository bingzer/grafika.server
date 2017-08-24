using Grafika.Animations;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using Grafika.Utilities;

namespace Grafika.Services.Backgrounds
{
    class BackgroundService : EntityService<Background, BackgroundQueryOptions, IBackgroundRepository>, IBackgroundService
    {
        private readonly IAwsFrameRepository _frameRepository;
        private readonly IResourceService _resourceService;

        public BackgroundService(IServiceContext context, 
            IBackgroundRepository repository, 
            IBackgroundValidator validator,
            IAwsFrameRepository frameRepository,
            IResourceService resourceService) 
            : base(context, repository, validator)
        {
            _frameRepository = frameRepository;
            _resourceService = resourceService;
        }

        public override async Task<Background> Delete(string entityId)
        {
            var animation = await GetById(entityId);

            animation.IsRemoved = true;
            animation.DateModified = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            Validator.Validate(animation);

            return await Repository.Update(animation);
        }

        public Task Delete(IEnumerable<string> backgroundIds)
        {
            // TODO: Check permission for User
            //       Only allows by System user
            return Repository.RemoveByIds(backgroundIds);
        }

        public async Task<FrameData> GetFrameData(string backgroundId, FrameData frameData)
        {
            var background = await GetById(backgroundId);
            return await _frameRepository.GetFrameData(background, frameData);
        }

        public async Task PostFrameData(string backgroundId, FrameData frameData)
        {
            var background = await GetById(backgroundId);
            await _frameRepository.PostFrameData(background, frameData);
        }

        public async Task<ISignedUrl> CreateThumbnail(string backgroundId)
        {
            var background = await GetById(backgroundId);
            var signedUrl = await _resourceService.CreateResource(background, Thumbnail.Create());
            return signedUrl;
        }

        public Task<bool> DeleteThumbnail(string backgroundId)
        {
            return _resourceService.DeleteResource(EntityType.Background, backgroundId, Thumbnail.ResourceId);
        }

        public Task<string> GetThumbnailUrl(string backgroundId)
        {
            return _resourceService.GetResourceUrl(EntityType.Background, backgroundId, Thumbnail.ResourceId);
        }

        public Task<bool> HasThumbnail(string backgroundId)
        {
            return _resourceService.HasResource(EntityType.Background, backgroundId, Thumbnail.ResourceId);
        }

        protected internal override async Task<Background> CreateEntityForUpdate(Background source)
        {
            if (!await Repository.Any(new BackgroundQueryOptions { Id = source.Id, UserId = User.Id }))
                throw new NotAuthorizedException();

            // only update some fields
            return new Background
            {
                Id = source.Id,
                LocalId = source.LocalId,
                Author = source.Author,
                Category = source.Category,
                Client = source.Client,
                DateModified = source.DateModified,
                Description = source.Description,
                Height = source.Height,
                IsPublic = source.IsPublic,
                Name = source.Name,
                UserId = source.UserId,
                Width = source.Width
            };
        }

        protected internal override async Task<Background> PrepareEntityForCreate(Background source)
        {
            var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var userService = Context.ServiceProvider.Get<IUserService>();
            var user = await userService.Get(User.Id);

            if (user == null)
                throw new NotAuthorizedException();

            source.UserId = User.Id;
            source.Type = EntityType.Background;
            source.IsRemoved = false;
            if (source.IsPublic == null)
                source.IsPublic = user.Prefs.DrawingIsPublic ?? true;
            if (source.DateCreated == null)
                source.DateCreated = now;
            if (source.DateModified == null)
                source.DateModified = now;
            if (source.Author == null)
                source.Author = user.Prefs.DrawingAuthor ?? user.Username;

            return source;
        }
    }
}
