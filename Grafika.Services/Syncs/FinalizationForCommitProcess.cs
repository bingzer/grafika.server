using System.Threading.Tasks;
using Grafika.Syncs;
using System.Linq;
using Grafika.Utilities;
using System;
using Grafika.Animations;

namespace Grafika.Services.Syncs
{
    class FinalizationForCommitProcess : FinalizationProcess
    {

        public override string ProcessName => "Finalization (for update)";

        public FinalizationForCommitProcess(IServiceProvider serviceProvider, IUser user) 
            : base(serviceProvider, user)
        {
        }

        protected override async Task ExecuteSync(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            await CheckFinalizationForAnimations(result);
            await CheckFinalizationForBackgrounds(result);
        }

        private Task CheckFinalizationForAnimations(SyncResult result)
        {
            var animationIds = result.Events.Where(e => e.Action == SyncAction.ServerDelete)
                                    .Where(e => e.EntityType == Animation.DefaultType)
                                    .Select(e => e.EntityId);

            if (!animationIds.Any()) return Task.FromResult(0);

            var animService = ServiceProvider.Get<IAnimationService>();
            return animService.Delete(animationIds);
        }

        private Task CheckFinalizationForBackgrounds(SyncResult result)
        {
            var backgroundIds = result.Events.Where(e => e.Action == SyncAction.ServerDelete)
                                    .Where(e => e.EntityType == Background.DefaultType)
                                    .Select(e => e.EntityId);

            if (!backgroundIds.Any()) return Task.FromResult(0);

            var backgroundService = ServiceProvider.Get<IBackgroundService>();
            return backgroundService.Delete(backgroundIds);
        }
    }
}
