using System.Threading.Tasks;
using Grafika.Syncs;
using System.Linq;
using Grafika.Utilities;
using System;

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
            var animationIds = result.Events.Where(e => e.Action == SyncAction.ServerDelete).Select(e => e.AnimationId);

            var animService = ServiceProvider.Get<IAnimationService>();
            await animService.BulkDeleteAnimations(animationIds);
        }
    }
}
