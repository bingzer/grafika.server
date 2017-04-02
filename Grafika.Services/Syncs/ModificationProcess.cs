using System;
using System.Threading.Tasks;
using Grafika.Syncs;
using Microsoft.Extensions.Logging;

namespace Grafika.Services.Syncs
{
    class ModificationProcess : SyncProcess
    {
        public ModificationProcess(IServiceProvider serviceProvider, IUser user) 
            : base(serviceProvider, user)
        {
        }

        public override string ProcessName => "Modification";

        protected override Task ExecuteSync(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            Logger.LogInformation("Modification");

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

            return Task.FromResult(0);
        }
    }
}
