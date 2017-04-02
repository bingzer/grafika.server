using System.Threading.Tasks;
using Grafika.Syncs;
using Grafika.Utilities;
using System;

namespace Grafika.Services.Syncs
{
    class PreparationProcess : SyncProcess
    {
        public override string ProcessName => "Preparation";

        public PreparationProcess(IServiceProvider serviceProvider, IUser user) 
            : base(serviceProvider, user)
        {
        }

        protected override Task ExecuteSync(SyncResult result, ILocalChanges localChanges, IServerChanges serverChanges)
        {
            try
            {
                ValidateUser(User);
                ValidateSyncResult(result);
                ValidateLocalSync(localChanges);
            }
            catch (NotValidException e)
            {
                throw e;
            }
            catch (Exception e)
            {
                throw new NotValidException(inner: e);
            }

            return Task.FromResult(0);
        }

        private void ValidateUser(IUser user)
        {
            Ensure.NotNull(User);
        }

        private void ValidateLocalSync(ILocalChanges localChanges)
        {
            Ensure.NotNull(localChanges, nameof(localChanges));
            Ensure.NotNull(localChanges.UserId, nameof(localChanges.UserId));
            Ensure.NotNull(localChanges.ClientId, nameof(localChanges.ClientId));
            Ensure.NotNull(localChanges.Animations, nameof(localChanges.Animations));
            Ensure.NotNull(localChanges.Tombstones, nameof(localChanges.Tombstones));
            if (User.Id != localChanges.UserId)
                throw new NotValidException("LocalSync.User.Id does not match");
        }

        private void ValidateSyncResult(SyncResult syncResult)
        {
            Ensure.NotNull(syncResult, nameof(syncResult));
            Ensure.NotNull(syncResult.ClientId, nameof(syncResult.ClientId));
            Ensure.NotNull(syncResult.SyncDate, nameof(syncResult.SyncDate));
        }
    }
}
