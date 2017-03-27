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

            return Task.FromResult(0);
        }
    }
}
