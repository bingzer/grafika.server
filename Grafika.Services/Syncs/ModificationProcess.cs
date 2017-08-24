using System;
using System.Threading.Tasks;
using Grafika.Syncs;
using Microsoft.Extensions.Logging;

namespace Grafika.Services.Syncs
{
    class ModificationProcess : SyncProcess
    {

        public override string ProcessName => "Modification";

        public ModificationProcess(IServiceProvider serviceProvider, IUser user) 
            : base(serviceProvider, user)
        {
        }

        protected override Task ExecuteSync(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            CheckModificationForAnimations(result, localChanges, serverChanges);
            CheckModificationForBackgrounds(result, localChanges, serverChanges);

            return Task.FromResult(0);
        }

        private void CheckModificationForAnimations(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            foreach (var localAnim in localChanges.Animations)
            {
                foreach (var serverAnim in serverChanges.Animations)
                {
                    if (localAnim.Equals(serverAnim))
                    {
                        if (localAnim.DateModified < serverAnim.DateModified)
                            result.AddAction(SyncAction.ClientOutOfDate, localAnim);
                        if (localAnim.DateModified > serverAnim.DateModified)
                            result.AddAction(SyncAction.ServerOutOfDate, localAnim);
                    }
                }
            }
        }

        private void CheckModificationForBackgrounds(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            if (localChanges.Backgrounds == null) return;

            foreach (var localBackground in localChanges.Backgrounds)
            {
                foreach (var serverBackground in serverChanges.Backgrounds)
                {
                    if (localBackground.Equals(serverBackground))
                    {
                        if (localBackground.DateModified < serverBackground.DateModified)
                            result.AddAction(SyncAction.ClientOutOfDate, localBackground);
                        if (localBackground.DateModified > serverBackground.DateModified)
                            result.AddAction(SyncAction.ServerOutOfDate, localBackground);
                    }
                }
            }
        }
    }
}
