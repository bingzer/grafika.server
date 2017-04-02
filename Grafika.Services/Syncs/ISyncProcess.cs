using Grafika.Syncs;
using Grafika.Utilities;
using System.Threading.Tasks;

namespace Grafika.Services.Syncs
{
    interface ISyncProcess
    {
        Task<SyncResult> Sync(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges);
    }
}
