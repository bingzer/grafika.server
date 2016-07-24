"use strict";
var sync_1 = require('../models/sync');
var animation_1 = require('../models/animation');
(function (SyncAction) {
    SyncAction[SyncAction["Ok"] = 0] = "Ok";
    SyncAction[SyncAction["ClientPull"] = 1] = "ClientPull";
    SyncAction[SyncAction["ClientPush"] = 2] = "ClientPush";
    SyncAction[SyncAction["ClientDelete"] = 3] = "ClientDelete";
})(exports.SyncAction || (exports.SyncAction = {}));
var SyncAction = exports.SyncAction;
var SyncEvent = (function () {
    function SyncEvent(action, animationId, localId) {
        this.action = action;
        this.animationId = animationId;
        this.localId = localId;
    }
    return SyncEvent;
}());
exports.SyncEvent = SyncEvent;
var SyncResult = (function () {
    function SyncResult(clientId) {
        this.syncDate = Date.now();
        this.events = [];
        this.clientId = clientId;
    }
    return SyncResult;
}());
exports.SyncResult = SyncResult;
var Synchronizer = (function () {
    function Synchronizer(localSync) {
        this.localSync = localSync;
        this.localAnimations = localSync.animations;
        this.syncResult = new SyncResult(localSync.clientId);
    }
    Synchronizer.prototype.sync = function (callback) {
        var _this = this;
        sync_1.Sync.findById(this.localSync._id, function (err, serverSync) {
            if (err)
                return callback(err, _this.syncResult);
            if (!serverSync)
                return callback(err, _this.syncResult);
            _this.serverSync = serverSync;
            animation_1.Animation.find({ _id: { $in: _this.serverSync.animationIds } }, function (err, remoteAnimations) {
                if (err)
                    return callback(err, _this.syncResult);
                _this.serverAnimations = remoteAnimations;
                _this.checkDateModified();
                _this.checkDeleted();
                callback(err, _this.syncResult);
            });
        });
    };
    Synchronizer.prototype.checkDateModified = function () {
        for (var i = 0; i < this.serverAnimations.length; i++) {
            var remote = this.serverAnimations[i];
            var event_1 = new SyncEvent(SyncAction.Ok, remote._id, remote.localId);
            var localExists = false;
            for (var j = 0; j < this.localAnimations.length; j++) {
                var local = this.localAnimations[j];
                if (remote._id == local._id) {
                    if (remote.dateModified > local.dateModified)
                        event_1.action = SyncAction.ClientPull;
                    else if (remote.dateModified < local.dateModified)
                        event_1.action = SyncAction.ClientPush;
                    localExists = true;
                    break;
                }
            }
            if (!localExists) {
                event_1.action = SyncAction.ClientPull;
            }
            if (event_1.action != SyncAction.Ok)
                this.syncResult.events.push(event_1);
        }
    };
    Synchronizer.prototype.checkDeleted = function () {
        if (this.serverSync.dateModified > this.localSync.dateModified) {
            for (var i = 0; i < this.serverAnimations.length; i++) {
                var remoteAnim = this.serverAnimations[i];
                var event_2 = new SyncEvent(SyncAction.Ok, remoteAnim._id, remoteAnim.localId);
                var foundLocal = false;
                for (var j = 0; j < this.localAnimations.length; j++) {
                    var localAnim = this.localAnimations[j];
                    if (remoteAnim._id == localAnim._id) {
                        foundLocal = true;
                        break;
                    }
                }
                if (!foundLocal) {
                    event_2.action = SyncAction.ClientPull;
                }
                if (event_2.action != SyncAction.Ok)
                    this.addSyncEvent(event_2);
            }
        }
        else if (this.serverSync.dateModified < this.localSync.dateModified) {
            for (var i = 0; i < this.localAnimations.length; i++) {
                var localAnim = this.localAnimations[i];
                var event_3 = new SyncEvent(SyncAction.Ok, localAnim._id, localAnim.localId);
                var foundRemote = false;
                for (var j = 0; j < this.serverAnimations.length; j++) {
                    var remoteAnim = this.serverAnimations[j];
                    if (localAnim._id == remoteAnim._id) {
                        foundRemote = true;
                        break;
                    }
                }
                if (!foundRemote) {
                    event_3.action = SyncAction.ClientPush;
                }
                if (event_3.action != SyncAction.Ok)
                    this.addSyncEvent(event_3);
            }
        }
    };
    Synchronizer.prototype.addSyncEvent = function (event) {
        for (var i = 0; i < this.syncResult.events.length; i++) {
            if (this.syncResult.events[i].animationId == event.animationId)
                return;
        }
        this.syncResult.events.push(event);
    };
    return Synchronizer;
}());
exports.Synchronizer = Synchronizer;
//# sourceMappingURL=synchronizer.js.map