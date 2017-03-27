using System;
using System.Threading.Tasks;
using Grafika.Syncs;

namespace Grafika.Services.Syncs
{
    class AdditionProcess : SyncProcess
    {
        public override string ProcessName => "Addition";

        public AdditionProcess(IServiceProvider serviceProvider, IUser user) 
            : base(serviceProvider, user)
        {
        }

        protected override Task ExecuteSync(SyncResult result, ILocalChanges localChanges, IServerChanges serverSync)
        {
            CheckLocalAddition(result, localChanges, serverSync);
            CheckServerAddition(result, localChanges, serverSync);

            return Task.FromResult(0);
        }

        private void CheckLocalAddition(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            foreach (var localAnim in localChanges.Animations)
            {
                var serverMissing = true;

                foreach (var serverAnim in serverChanges.Animations)
                {
                    if (localAnim.Equals(serverAnim))
                    {
                        serverMissing = false;
                        break;
                    }
                }

                foreach (var serverAnim in serverChanges.Tombstones)
                {
                    if (localAnim.Equals(serverAnim))
                    {
                        serverMissing = false;
                        break;
                    }
                }

                if (serverMissing)
                    result.AddAction(SyncAction.ServerMissing, localAnim);
            }
        }

        private void CheckServerAddition(SyncResult result, ILocalChanges localChanges, IServerChanges serverSync)
        {
            foreach (var serverAnim in serverSync.Animations)
            {
                var clientMissing = true;

                foreach (var localAnim in localChanges.Animations)
                {
                    if (localAnim.Equals(serverAnim))
                    {
                        clientMissing = false;
                        break;
                    }
                }

                foreach (var localAnim in localChanges.Tombstones)
                {
                    if (localAnim.Equals(serverAnim))
                    {
                        clientMissing = false;
                        break;
                    }
                }

                if (clientMissing)
                    result.AddAction(SyncAction.ClientMissing, serverAnim);
            }
        }
    }
}
