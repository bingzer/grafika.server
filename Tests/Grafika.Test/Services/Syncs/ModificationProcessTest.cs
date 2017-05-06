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
    public class ModificationProcessTest
    {
        [Fact]
        public async void TestSync()
        {
            const string ClientId = "ClientId";
            var user = new User();
            var process = new ModificationProcess(MockHelpers.ServiceProvider.Object, user);

            var syncResult = new SyncResult(ClientId);
            var localChanges = new LocalChanges
            {
                UserId = user.Id,
                ClientId = ClientId,
                Animations = new List<Animation>
                {
                    new Animation { Id = "Local1", LocalId = "Local1", DateModified = 100 },
                    new Animation { Id = "Server1", LocalId = "Server1", DateModified = 50 }
                },
                Tombstones = new List<Animation>
                {
                    new Animation { Id = "LocalTrash1", LocalId = "LocalTrash1" }
                }
            };
            
            var serverChanges = new ServerChanges
            {
                UserId = user.Id,
                Animations = new List<Animation>
                {
                    new Animation { Id = "Local1", LocalId = "Local1", DateModified = 50 },
                    new Animation { Id = "Server1", LocalId = "Server1", DateModified = 100 }
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
            Assert.True(events.Any(e => e.Action == SyncAction.ServerOutOfDate && e.EntityId == "Local1" && e.EntityType == EntityType.Animation));
            Assert.True(events.Any(e => e.Action == SyncAction.ClientOutOfDate && e.EntityId == "Server1" && e.EntityType == EntityType.Animation));
        }

        [Fact]
        public async void TestSync_WithBackground()
        {
            const string ClientId = "ClientId";
            var user = new User();
            var process = new ModificationProcess(MockHelpers.ServiceProvider.Object, user);

            var syncResult = new SyncResult(ClientId);
            var localChanges = new LocalChanges
            {
                UserId = user.Id,
                ClientId = ClientId,
                Animations = new List<Animation>
                {
                    new Animation { Id = "Local1", LocalId = "Local1", DateModified = 100 },
                    new Animation { Id = "Server1", LocalId = "Server1", DateModified = 50 }
                },
                Tombstones = new List<Animation>
                {
                    new Animation { Id = "LocalTrash1", LocalId = "LocalTrash1" }
                },
                Backgrounds = new List<Background>
                {
                    new Background { Id = "LocalBack1", LocalId = "LocalBack1", DateModified = 100 },
                    new Background { Id = "ServerBack1", LocalId = "ServerBack1", DateModified = 50 }
                },
                BackgroundTombstones = new List<Background>
                {
                    new Background { Id = "LocalTrashBack1", LocalId = "LocalTrashBack1" }
                }
            };

            var serverChanges = new ServerChanges
            {
                UserId = user.Id,
                Animations = new List<Animation>
                {
                    new Animation { Id = "Local1", LocalId = "Local1", DateModified = 50 },
                    new Animation { Id = "Server1", LocalId = "Server1", DateModified = 100 }
                },
                Tombstones = new List<Animation>
                {
                    new Animation { Id = "ServerTrash1", LocalId = "ServerTrash1" }
                },
                Backgrounds = new List<Background>
                {
                    new Background { Id = "LocalBack1", LocalId = "LocalBack1", DateModified = 50 },
                    new Background { Id = "ServerBack1", LocalId = "ServerBack1", DateModified = 100 }
                },
                BackgroundTombstones = new List<Background>
                {
                    new Background { Id = "ServerTrashBack1", LocalId = "ServerTrashBack1" }
                }
            };

            await process.Sync(syncResult, localChanges, serverChanges);


            // check sync events
            var events = syncResult.Events.ToList();
            Assert.Equal(4, events.Count);
            Assert.True(events.Any(e => e.Action == SyncAction.ServerOutOfDate && e.EntityId == "Local1" && e.EntityType == EntityType.Animation));
            Assert.True(events.Any(e => e.Action == SyncAction.ClientOutOfDate && e.EntityId == "Server1" && e.EntityType == EntityType.Animation));
            Assert.True(events.Any(e => e.Action == SyncAction.ServerOutOfDate && e.EntityId == "LocalBack1" && e.EntityType == EntityType.Background));
            Assert.True(events.Any(e => e.Action == SyncAction.ClientOutOfDate && e.EntityId == "ServerBack1" && e.EntityType == EntityType.Background));
        }
    }
}
