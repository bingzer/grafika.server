using Grafika.Animations;
using Grafika.Services;
using Grafika.Services.Syncs;
using Grafika.Syncs;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Syncs
{
    public class FinalizationForCommitProcessTest
    {
        [Fact]
        public async void TestSync()
        {
            var mockAnimservice = new Mock<IAnimationService>();
            var mockServiceProvider = MockHelpers.ServiceProvider;
            mockServiceProvider
                .Setup(c => c.GetService(It.Is<Type>(t => t == typeof(IAnimationService))))
                .Returns(mockAnimservice.Object);

            var user = new User();
            var process = new FinalizationForCommitProcess(mockServiceProvider.Object, user);

            var localChanges = new LocalChanges();
            var serverChanges = new ServerChanges();
            var syncResult = new SyncResult(localChanges.ClientId);
            syncResult.AddAction(SyncAction.ServerDelete, new Animation { Id = "ServerDelete1" });
            syncResult.AddAction(SyncAction.ServerDelete, new Animation { Id = "ServerDelete2" });
            syncResult.AddAction(SyncAction.ServerDelete, new Animation { Id = "ServerDelete3" });
            syncResult.AddAction(SyncAction.ClientDelete, new Animation { Id = "ClientDelete1" });
            syncResult.AddAction(SyncAction.ClientMissing, new Animation { Id = "ClientMissing1" });

            syncResult = await process.Sync(syncResult, localChanges, serverChanges);

            mockAnimservice.Verify(c => c.BulkDeleteAnimations(It.Is<IEnumerable<string>>(ids =>
                ids.Count() == 3 && 
                ids.Any(id => id == "ServerDelete1") &&
                ids.Any(id => id == "ServerDelete2") &&
                ids.Any(id => id == "ServerDelete3")
            )));
        }
    }
}
