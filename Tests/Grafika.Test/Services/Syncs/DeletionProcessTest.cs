using Grafika.Animations;
using Grafika.Services.Syncs;
using Grafika.Syncs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace Grafika.Test.Services.Syncs
{
    public class DeletionProcessTest
    {

        [Fact]
        public async void TestSync()
        {
            const string ClientId = "ClientId";
            var user = new User();
            var process = new DeletionProcess(MockHelpers.ServiceProvider.Object, user);

            var syncResult = new SyncResult(ClientId);
            var localChanges = new LocalChanges
            {
                UserId = user.Id,
                ClientId = ClientId,
                Animations = new List<Animation>
                {
                    new Animation { Id = "Local1", LocalId = "Local1" },
                    new Animation { Id = "Server2", LocalId = "Server2" },
                    new Animation { Id = "Server1", LocalId = "Server1" }
                },
                Tombstones = new List<Animation>
                {
                    new Animation { Id = "Local2", LocalId = "Local2" },
                    new Animation { Id = "Local3", LocalId = "Local3" }, // doesn't exists in the server, should get ignored
                }
            };

            // server changes has one local animation
            var serverChanges = new ServerChanges
            {
                UserId = user.Id,
                Animations = new List<Animation>
                {
                    new Animation { Id = "Server1", LocalId = "Server1" },
                    new Animation { Id = "Local1", LocalId = "Local1" },
                    new Animation { Id = "Local2", LocalId = "Local2" },
                },
                Tombstones = new List<Animation>
                {
                    new Animation { Id = "Server2", LocalId = "Server2" },
                    new Animation { Id = "Server3", LocalId = "Server3" }, // doesn't exists locally, should get ignored
                }
            };

            await process.Sync(syncResult, localChanges, serverChanges);


            // check sync events
            var events = syncResult.Events.ToList();
            Assert.Equal(2, events.Count);
            Assert.True(events.Any(e => e.Action == SyncAction.ClientDelete && e.AnimationId == "Server2"));
            Assert.True(events.Any(e => e.Action == SyncAction.ServerDelete && e.AnimationId == "Local2"));
        }
    }
}
