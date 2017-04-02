using Grafika.Animations;
using Grafika.Services.Syncs;
using Grafika.Syncs;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace Grafika.Test.Services.Syncs
{
    public class AdditionProcessTest
    {
        [Fact]
        public async void TestSync()
        {
            const string ClientId = "ClientId";
            var user = new User();
            var process = new AdditionProcess(MockHelpers.ServiceProvider.Object, user);

            var syncResult = new SyncResult(ClientId);
            var localChanges = new LocalChanges
            {
                UserId = user.Id,
                ClientId = ClientId,
                Animations = new List<Animation>
                {
                    new Animation { Id = "Local1", LocalId = "Local1" },
                    new Animation { Id = "Local2", LocalId = "Local2" }
                },
                Tombstones = new List<Animation>
                {
                    new Animation { Id = "LocalTrash1", LocalId = "LocalTrash1" }
                }
            };

            // server changes has one local animation
            var serverChanges = new ServerChanges
            {
                UserId = user.Id,
                Animations = new List<Animation>
                {
                    new Animation { Id = "Server1", LocalId = "Server1" },
                    new Animation { Id = "Local1", LocalId = "Local1" }
                },
                Tombstones = new List<Animation>
                {
                    new Animation { Id = "ServerTrash1", LocalId = "ServerTrash1" }
                }
            };

            await process.Sync(syncResult, localChanges, serverChanges);


            // check sync events
            var events = syncResult.Events.ToList();
            Assert.Equal(2, events.Count);
            Assert.True(events.Any(e => e.Action == SyncAction.ServerMissing && e.AnimationId == "Local2"));
            Assert.True(events.Any(e => e.Action == SyncAction.ClientMissing && e.AnimationId == "Server1"));
        }
    }
}
