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
        private readonly IAnimationRepository _animRepo;

        public SeriesService(IServiceContext context, 
            ISeriesRepository repository, 
            ISeriesValidator validator,
            IUserService userService,
            IAnimationRepository animRepo) 
            : base(context, repository, validator)
        {
            _userService = userService;
            _animRepo = animRepo;
        }

        public override async Task<IEnumerable<Series>> List(SeriesQueryOptions options)
        {
            var list = await base.List(options);

            if (options.LoadAnimations == true)
            {
                var animationIds = list.SelectMany(s => s.AnimationIds);
                foreach (var series in list)
                {
                    series.Animations = await GetAnimationByIds(series.AnimationIds);
                }
            }

            return list;
        }

        public override async Task<Series> Get(string entityId)
        {
            var series = await base.Get(entityId);
            series.Animations = await GetAnimationByIds(series.AnimationIds);
            return series;
        }

        private async Task<IEnumerable<Animation>> GetAnimationByIds(IEnumerable<string> animationIds)
        {
            var animations = await _animRepo.Find(new AnimationQueryOptions { Ids = animationIds });
            return animations.Where(anim => animationIds.Contains(anim.Id) && anim.IsPublic == true && anim.IsRemoved == false)
                           .ToList();
        }

        public async Task EnsureHandpickedSeriesCreated()
        {
            var grafikaUser = (await _userService.List(new UserQueryOptions { Email = "grafika@bingzer.com" })).First();
            var seriesOptions = new SeriesQueryOptions { UserId = grafikaUser.Id, Name = SeriesName };

            var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            Series series;
            if (! await Repository.Any(seriesOptions))
            {
                // create one
                series = new Series
                {
                    UserId = grafikaUser.Id,
                    Name = SeriesName,
                    Description = "",
                    DateCreated = now,
                    DateModified = now,
                    AnimationIds = AppEnvironment.Default.Server.HandpickedAnimationIds
                };

                await Repository.Add(series);
            }

            series = await Repository.First(seriesOptions);
            if (series.AnimationIds == null || !series.AnimationIds.Any())
            {
                series.DateModified = now;
                series.AnimationIds = AppEnvironment.Default.Server.HandpickedAnimationIds;
                await Repository.Update(series);
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
