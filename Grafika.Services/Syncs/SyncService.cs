using System;
using System.Threading.Tasks;
using Grafika.Syncs;
using System.Collections.Generic;
using Grafika.Animations;
using System.Linq;

namespace Grafika.Services.Syncs
{
    class SyncService : Service, ISyncService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IAnimationRepository _animationRepo;
        private readonly IBackgroundRepository _backgroundRepo;

        public SyncService(IServiceContext serviceContext, IAnimationRepository animationRepo, IBackgroundRepository backgroundRepo) 
            : base(serviceContext)
        {
            _serviceProvider = serviceContext.ServiceProvider;
            _animationRepo = animationRepo;
            _backgroundRepo = backgroundRepo;
        }

        public async Task<SyncResult> Sync(ILocalChanges localChanges)
        {
            var syncResult = new SyncResult(localChanges.ClientId);
            var serverChanges = await FindServerChanges(localChanges.UserId);

            // TODO: move this block to a factory
            var queue = new Queue<ISyncProcess>();
            queue.Enqueue(new PreparationProcess(_serviceProvider, User));
            queue.Enqueue(new AdditionProcess(_serviceProvider, User));
            queue.Enqueue(new ModificationProcess(_serviceProvider, User));
            queue.Enqueue(new DeletionProcess(_serviceProvider, User));
            queue.Enqueue(new FinalizationProcess(_serviceProvider, User));

            while(queue.Any())
            {
                var syncProcess = queue.Dequeue();
                await syncProcess.Sync(syncResult, localChanges, serverChanges);
            }

            return syncResult;
        }

        public async Task<SyncResult> Commit(ILocalChanges localChanges, SyncResult syncResult)
        {
            var serverChanges = await FindServerChanges(localChanges.UserId);

            // TODO: move this block to a factory
            var queue = new Queue<ISyncProcess>();
            queue.Enqueue(new PreparationProcess(_serviceProvider, User));
            queue.Enqueue(new FinalizationForCommitProcess(_serviceProvider, User));

            while (queue.Any())
            {
                var syncProcess = queue.Dequeue();
                await syncProcess.Sync(syncResult, localChanges, serverChanges);
            }

            return syncResult;
        }

        internal async Task<IServerChanges> FindServerChanges(string userId)
        {
            var serverChanges = new ServerChanges
            {
                UserId = userId,
                Animations = await _animationRepo.Find(new AnimationQueryOptions { UserId = userId, IsRemoved = false, PageSize = -1 }),
                Tombstones = await _animationRepo.Find(new AnimationQueryOptions { UserId = userId, IsRemoved = true, PageSize = -1 }),
                Backgrounds = await _backgroundRepo.Find(new BackgroundQueryOptions { UserId = userId, IsRemoved = false, PageSize = -1 }),
                BackgroundTombstones = await _backgroundRepo.Find(new BackgroundQueryOptions { UserId = userId, IsRemoved = true, PageSize = -1 })
            };
            return serverChanges;
        }
    }

    class ServerChanges : IServerChanges
    {
        public string UserId { get; set; }

        public IEnumerable<Animation> Animations { get; set; }
        public IEnumerable<Animation> Tombstones { get; set; }
        public IEnumerable<Background> Backgrounds { get; set; }
        public IEnumerable<Background> BackgroundTombstones { get; set; }
    }
}
