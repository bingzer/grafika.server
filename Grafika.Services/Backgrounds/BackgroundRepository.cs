using Grafika.Animations;
using Grafika.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Grafika.Services.Backgrounds
{
    class BackgroundRepository : RepositoryBase<IDataContext, Background, BackgroundQueryOptions>, IBackgroundRepository
    {
        private readonly IBulkRemoveProvider<Background> _bulkRemoveProvider;
        private readonly ITextSearchProvider<Background, BackgroundQueryOptions> _textSearchProvider;

        public BackgroundRepository(IDataContext dataContext,
            ITextSearchProvider<Background, BackgroundQueryOptions> textSearchProvider,
            IBulkRemoveProvider<Background> bulkRemoveProvider) 
            : base(dataContext)
        {
            _bulkRemoveProvider = bulkRemoveProvider;
            _textSearchProvider = textSearchProvider;
        }

        public Task RemoveByIds(IEnumerable<string> backgroundIds)
        {
            return _bulkRemoveProvider.BulkRemove(DataContext.Backgrounds, backgroundIds);
        }

        protected override async Task<IEnumerable<Background>> Query(BackgroundQueryOptions options = null)
        {
            IQueryable<Background> query = DataContext.Backgrounds;

            if (!string.IsNullOrEmpty(options.Term))
                return await _textSearchProvider.TextSearchAsync(DataContext.Backgrounds, options);

            if (!string.IsNullOrEmpty(options.Id))
                query = query.Where(q => q.Id == options.Id);
            if (!string.IsNullOrEmpty(options.UserId))
                query = query.Where(q => q.UserId == options.UserId);
            if (options.IsPublic.HasValue)
                query = query.Where(q => q.IsPublic == options.IsPublic);
            if (options.IsRemoved.HasValue)
                query = query.Where(q => q.IsRemoved == options.IsRemoved);

            return query;
        }
    }
}
