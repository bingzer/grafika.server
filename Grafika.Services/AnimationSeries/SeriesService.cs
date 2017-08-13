using Grafika.Animations;
using Grafika.Configurations;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Grafika.Services.AnimationSeries
{
    class SeriesService : EntityService<Series, SeriesQueryOptions, ISeriesRepository>, ISeriesService
    {
        private const string SeriesName = "Handpicked";
        private readonly IUserService _userService;
        private readonly IAnimationService _animService;

        public SeriesService(IServiceContext context, 
            ISeriesRepository repository, 
            ISeriesValidator validator,
            IUserService userService,
            IAnimationService animationService) 
            : base(context, repository, validator)
        {
            _userService = userService;
            _animService = animationService;
        }

        public override async Task<IEnumerable<Series>> List(SeriesQueryOptions options)
        {
            var list = await base.List(options);

            if (options.LoadAnimations == true)
            {
                var animationIds = list.SelectMany(s => s.AnimationIds);
                var animations = await _animService.List(new AnimationQueryOptions { Ids = animationIds });
                foreach (var series in list)
                {
                    series.Animations = animations.Where(anim => series.AnimationIds.Contains(anim.Id)).ToList();
                }
            }

            return list;
        }

        public override async Task<Series> Get(string entityId)
        {
            var series = await base.Get(entityId);
            series.Animations = await _animService.List(new AnimationQueryOptions { Ids = series.AnimationIds });
            return series;
        }

        public async Task EnsureHandpickedSeriesCreated()
        {
            var grafikaUser = (await _userService.List(new UserQueryOptions { Email = "grafika@bingzer.com" })).First();
            var seriesOptions = new SeriesQueryOptions { UserId = grafikaUser.Id, Name = SeriesName };
            if (! await Repository.Any(seriesOptions))
            {
                // create one
                var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                var series = new Series
                {
                    UserId = grafikaUser.Id,
                    Name = SeriesName,
                    Description = "",
                    DateCreated = now,
                    DateModified = now,
                    AnimationIds = AppEnvironment.Default.Content.HandpickedAnimationIds
                };

                await Repository.Add(series);
            }
        }

        public async Task<Series> GetHandpickedSeries()
        {
            var grafikaUser = (await _userService.List(new UserQueryOptions { Email = "grafika@bingzer.com" })).First();
            var seriesOptions = new SeriesQueryOptions { UserId = grafikaUser.Id, Name = SeriesName, LoadAnimations = true };

            return (await List(seriesOptions)).FirstOrDefault();
        }

        protected internal override Task<Series> CreateEntityForUpdate(Series source)
        {
            return Task.FromResult(source);
        }

        protected internal override Task<Series> PrepareEntityForCreate(Series source)
        {
            return Task.FromResult(source);
        }
    }
}
