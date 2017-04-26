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

        protected override Task ExecuteSync(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            // -- animations
            CheckLocalAdditionAnimations(result, localChanges, serverChanges);
            CheckServerAdditionAnimations(result, localChanges, serverChanges);

            // -- backgrounds
            if (localChanges.Backgrounds != null)
            {
                CheckLocalAdditionBackgrounds(result, localChanges, serverChanges);
                CheckServerAdditionBackgrounds(result, localChanges, serverChanges);
            }

            return Task.FromResult(0);
        }

        private void CheckLocalAdditionAnimations(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
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

        private void CheckLocalAdditionBackgrounds(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            foreach (var localBackground in localChanges.Backgrounds)
            {
                var serverMissing = true;

                foreach (var serverBackground in serverChanges.Backgrounds)
                {
                    if (localBackground.Equals(serverBackground))
                    {
                        serverMissing = false;
                        break;
                    }
                }

                foreach (var serverBackground in serverChanges.BackgroundTombstones)
                {
                    if (localBackground.Equals(serverBackground))
                    {
                        serverMissing = false;
                        break;
                    }
                }

                if (serverMissing)
                    result.AddAction(SyncAction.ServerMissing, localBackground);
            }
        }

        private void CheckServerAdditionAnimations(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            foreach (var serverAnim in serverChanges.Animations)
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

        private void CheckServerAdditionBackgrounds(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            foreach (var serverBackground in serverChanges.Backgrounds)
            {
                var clientMissing = true;

                foreach (var localBackground in localChanges.Backgrounds)
                {
                    if (localBackground.Equals(serverBackground))
                    {
                        clientMissing = false;
                        break;
                    }
                }

                foreach (var localBackground in localChanges.BackgroundTombstones)
                {
                    if (localBackground.Equals(serverBackground))
                    {
                        clientMissing = false;
                        break;
                    }
                }

                if (clientMissing)
                    result.AddAction(SyncAction.ClientMissing, serverBackground);
            }
        }
    }
}
