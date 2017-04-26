using Grafika.Animations;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Grafika.Services.Backgrounds
{
    class BackgroundService : EntityService<Background, BackgroundQueryOptions, IBackgroundRepository>, IBackgroundService
    {
        public BackgroundService(IServiceContext context, IBackgroundRepository repository, IEntityValidator<Background> validator) 
            : base(context, repository, validator)
        {
        }

        public Task Delete(IEnumerable<string> backgroundIds)
        {
            // TODO: Check permission for User
            //       Only allows by System user
            return Repository.RemoveByIds(backgroundIds);
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
    }
}
