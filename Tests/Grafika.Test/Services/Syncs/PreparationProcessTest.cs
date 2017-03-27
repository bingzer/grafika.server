using Grafika.Services.Syncs;
using Grafika.Syncs;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Syncs
{
    public class PreparationProcessTest
    {
        private PreparationProcess _process;

        public PreparationProcessTest()
        {
            var user = new User();
            _process = new PreparationProcess(MockHelpers.ServiceProvider.Object, user);
        }

        [Fact]
        public async void TestSync()
        {
            var localChanges = new LocalChanges();
            var serverChanges = new ServerChanges();
            var syncResult = new SyncResult(localChanges.ClientId);

            await Assert.ThrowsAsync<NotValidException>(async () =>
            {
                syncResult = await _process.Sync(syncResult, localChanges, serverChanges);
            });
        }

        [Fact]
        public async void TestSync2()
        {
            var user = new User();

            var localChanges = new LocalChanges();
            var serverChanges = new ServerChanges();
            var syncResult = new SyncResult(localChanges.ClientId);

            await Assert.ThrowsAsync<NotValidException>(async () =>
            {
                syncResult = await _process.Sync(syncResult, localChanges, serverChanges);
            });
        }
    }
}
