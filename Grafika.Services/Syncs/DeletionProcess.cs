using System;
using System.Threading.Tasks;
using Grafika.Syncs;

namespace Grafika.Services.Syncs
{
    class DeletionProcess : SyncProcess
    {
        public override string ProcessName => "Deletion";

        public DeletionProcess(IServiceProvider serviceProvider, IUser user) 
            : base(serviceProvider, user)
        {
        }

        protected override Task ExecuteSync(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            CheckForAnimationDeletions(result, localChanges, serverChanges);
            CheckForBackgroundDeletions(result, localChanges, serverChanges);

            return Task.FromResult(0);
        }

        private void CheckForAnimationDeletions(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            foreach (var localAnim in localChanges.Tombstones)
            {
                foreach (var serverAnim in serverChanges.Animations)
                {
                    if (localAnim.Equals(serverAnim))
                    {
                        result.AddAction(SyncAction.ServerDelete, serverAnim);
                        break;
                    }
                }
            }

            foreach (var serverAnim in serverChanges.Tombstones)
            {
                foreach (var localAnim in localChanges.Animations)
                {
                    if (localAnim.Equals(serverAnim))
                    {
                        result.AddAction(SyncAction.ClientDelete, localAnim);
                        break;
                    }
                }
            }
        }

        private void CheckForBackgroundDeletions(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            if (localChanges.BackgroundTombstones != null)
            {
                foreach (var localBackground in localChanges.BackgroundTombstones)
                {
                    foreach (var serverBackground in serverChanges.Backgrounds)
                    {
                        if (localBackground.Equals(serverBackground))
                        {
                            result.AddAction(SyncAction.ServerDelete, serverBackground);
                            break;
                        }
                    }
                }
            }

            if (serverChanges.BackgroundTombstones != null)
            {
                foreach (var serverBackground in serverChanges.BackgroundTombstones)
                {
                    foreach (var localBackground in localChanges.Backgrounds)
                    {
                        if (localBackground.Equals(serverBackground))
                        {
                            result.AddAction(SyncAction.ClientDelete, localBackground);
                            break;
                        }
                    }
                }
            }
        }
    }
}
