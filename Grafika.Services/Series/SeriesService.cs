using System.Threading.Tasks;

namespace Grafika.Services.Series
{
    class SeriesService : EntityService<Grafika.Animations.Series, SeriesQueryOptions, ISeriesRepository>, ISeriesService
    {
        public SeriesService(IServiceContext context, ISeriesRepository repository, IEntityValidator<Grafika.Animations.Series> validator) 
            : base(context, repository, validator)
        {
        }

        protected internal override Task<Grafika.Animations.Series> CreateEntityForUpdate(Grafika.Animations.Series source)
        {
            return Task.FromResult(source);
        }

        protected internal override Task<Grafika.Animations.Series> PrepareEntityForCreate(Grafika.Animations.Series source)
        {
            return Task.FromResult(source);
        }
    }
}
