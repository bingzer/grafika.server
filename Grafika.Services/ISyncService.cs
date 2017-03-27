using Grafika.Syncs;
using System.Threading.Tasks;

namespace Grafika.Services
{
    public interface ISyncService : IService
    {
        /// <summary>
        /// Client will call this when trying to sync the data.
        /// Returns SyncResult or collections of actions that needs to be done
        /// on the client side
        /// </summary>
        /// <param name="localSync"></param>
        /// <returns></returns>
        Task<SyncResult> Sync(ILocalChanges localSync);

        /// <summary>
        /// Client should call this after syncing the data so that 
        /// the server acknoledges that the client has sync the data on their side.
        /// </summary>
        /// <param name="syncResult"></param>
        /// <returns></returns>
        Task<SyncResult> Commit(ILocalChanges localSync, SyncResult syncResult);
    }
}
