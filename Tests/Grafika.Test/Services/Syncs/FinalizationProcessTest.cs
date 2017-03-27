using Grafika.Services.Syncs;
using Grafika.Syncs;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Syncs
{
    public class FinalizationProcessTest
    {
        [Fact]
        public async void TestSync()
        {
            var user = new User();

            var process = new FinalizationProcess(MockHelpers.ServiceProvider.Object, user);

            var localChanges = new LocalChanges();
            var serverChanges = new ServerChanges();
            var syncResult = new SyncResult(localChanges.ClientId);

            syncResult = await process.Sync(syncResult, localChanges, serverChanges);
        }
    }
}
