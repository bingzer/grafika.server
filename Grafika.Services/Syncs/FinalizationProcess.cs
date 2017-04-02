using System;
using System.Threading.Tasks;
using Grafika.Syncs;
using Microsoft.Extensions.Logging;

namespace Grafika.Services.Syncs
{
    class FinalizationProcess : SyncProcess
    {
        public override string ProcessName => "Finalization";

        public FinalizationProcess(IServiceProvider serviceProvider, IUser user) 
            : base(serviceProvider, user)
        {
        }

        protected override Task ExecuteSync(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            Logger.LogInformation("Finalization", result);
            return Task.FromResult(0);
        }
    }
}
