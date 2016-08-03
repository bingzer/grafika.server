"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var sync_1 = require('../models/sync');
var animation_1 = require('../models/animation');
var user_1 = require('../models/user');
var _ = require('underscore');
var q = require('q');
var winston = require('winston');
var mongoose = require('mongoose');
(function (SyncAction) {
    SyncAction[SyncAction["Ok"] = 0] = "Ok";
    SyncAction[SyncAction["ClientPull"] = 1] = "ClientPull";
    SyncAction[SyncAction["ClientPush"] = 2] = "ClientPush";
    SyncAction[SyncAction["ClientDelete"] = 3] = "ClientDelete";
    SyncAction[SyncAction["ServerDelete"] = 4] = "ServerDelete";
})(exports.SyncAction || (exports.SyncAction = {}));
var SyncAction = exports.SyncAction;
var SyncEvent = (function () {
    function SyncEvent(action, animationId, localId) {
        this.action = action;
        this.animationId = animationId;
        this.localId = localId;
    }
    SyncEvent.prototype.display = function () {
        var str = 'Action=' + this.action + ' ';
        switch (this.action) {
            case SyncAction.Ok:
                str += "[Ok]";
                break;
            case SyncAction.ClientPull:
                str += "[ClientPull]";
                break;
            case SyncAction.ClientPush:
                str += "[ClientPush]";
                break;
            case SyncAction.ClientDelete:
                str += "[ClientDelete]";
                break;
            case SyncAction.ServerDelete:
                str += "[ServerDelete]";
                break;
            default:
                str += "[Unknown]";
                break;
        }
        str += ' AnimationId=' + this.animationId + ' LocalId=' + this.localId;
        return str;
    };
    return SyncEvent;
}());
exports.SyncEvent = SyncEvent;
var SyncResult = (function () {
    function SyncResult(clientId) {
        this.syncDate = Date.now();
        this.events = [];
        this.clientId = clientId;
    }
    SyncResult.prototype.addSyncEvent = function (event) {
        for (var i = 0; i < this.events.length; i++) {
            if (this.events[i].animationId == event.animationId || this.events[i].localId == event.localId)
                return;
        }
        this.events.push(event);
    };
    SyncResult.prototype.display = function () {
        var str = 'SyncResult:';
        if (this.events.length > 0) {
            for (var i = 0; i < this.events.length; i++) {
                str += '\n\t' + this.events[i].display();
            }
        }
        else {
            str += '\n\tNo Sync Event';
        }
        return str;
    };
    return SyncResult;
}());
exports.SyncResult = SyncResult;
var Synchronizer = (function () {
    function Synchronizer(localSync) {
        this.syncProcesses = [];
        this.localSync = localSync;
        this.syncResult = new SyncResult(localSync.clientId);
    }
    Synchronizer.prototype.sync = function () {
        var _this = this;
        winston.info("Sync: Started");
        winston.info("Sync: ClientID = " + this.localSync.clientId);
        winston.info("Sync: Id = " + this.localSync._id);
        var preparationProcess = new Preparation(this.syncResult, this.localSync);
        var additionProcess = new Addition(this.syncResult, this.localSync);
        var deletionProcess = new Deletion(this.syncResult, this.localSync);
        var modificationProcess = new Modification(this.syncResult, this.localSync);
        var finalizationProcess = new Finalization(this.syncResult, this.localSync);
        return preparationProcess.sync()
            .then(function (SyncResult) { return deletionProcess.sync(); })
            .then(function (SyncResult) { return additionProcess.sync(); })
            .then(function (syncResult) { return modificationProcess.sync(); })
            .then(function (SyncResult) { return finalizationProcess.sync(); })
            .finally(function () {
            winston.info('Sync: ' + _this.syncResult.display());
            winston.info("Sync: Done!!!!!");
            return q.when(_this.syncResult);
        });
    };
    return Synchronizer;
}());
exports.Synchronizer = Synchronizer;
var SyncProcess = (function () {
    function SyncProcess(name, syncResult, localSync) {
        this.name = name;
        this.syncResult = syncResult;
        this.localSync = localSync;
    }
    SyncProcess.prototype.sync = function () {
        var _this = this;
        var defer = q.defer();
        sync_1.Sync.findById(this.localSync._id, function (err, serverSync) {
            if (err)
                defer.reject(err);
            if (!serverSync) {
                var sync = new sync_1.Sync();
                sync._id = _this.localSync._id;
                sync.dateCreated = Date.now();
                sync.dateModified = _this.localSync.dateModified - 100;
                sync.animationIds = [];
                sync.save(function (err, res) {
                    if (err)
                        defer.reject(err);
                    else if (!res)
                        defer.reject('Unable to create server sync');
                    else
                        _this.executeSync(defer, res);
                });
            }
            else {
                _this.executeSync(defer, serverSync);
            }
        });
        return defer.promise;
    };
    SyncProcess.prototype.log = function (msg) {
        winston.info("Sync: [" + this.name + "] " + msg);
    };
    SyncProcess.prototype.executeSync = function (defer, serverSync) {
        var _this = this;
        var ids = _.map(serverSync.animationIds, function (animationId) { return new mongoose.Types.ObjectId(animationId); });
        animation_1.Animation.find({ _id: { $in: ids } }, { frames: 0 }).lean(true).exec(function (err, serverAnimations) {
            if (err)
                defer.reject(err);
            else {
                serverSync.animations = serverAnimations;
                _this.doSync(defer, _this.localSync, serverSync);
            }
        });
    };
    return SyncProcess;
}());
var Preparation = (function (_super) {
    __extends(Preparation, _super);
    function Preparation(syncResult, localSync) {
        _super.call(this, "Preparation", syncResult, localSync);
    }
    Preparation.prototype.doSync = function (defer, localSync, serverSync) {
        var _this = this;
        this.log("Preparation");
        return this.checkUser(localSync._id)
            .then(function () {
            defer.resolve(_this.syncResult);
        })
            .catch(function (err) {
            defer.reject(err);
        });
    };
    Preparation.prototype.checkUser = function (userId) {
        this.log("Check user");
        var defer = q.defer();
        user_1.User.findOne({ _id: userId, active: true }, function (err, user) {
            if (err)
                defer.reject(err);
            else if (!user)
                defer.reject('User not found');
            else {
                defer.resolve();
            }
        });
        return defer.promise;
    };
    return Preparation;
}(SyncProcess));
var Addition = (function (_super) {
    __extends(Addition, _super);
    function Addition(syncResult, localSync) {
        _super.call(this, "Addition", syncResult, localSync);
    }
    Addition.prototype.doSync = function (defer, localSync, serverSync) {
        this.log("Addition check");
        if (serverSync.dateModified > this.localSync.dateModified) {
            this.log("Server is more current");
            var addLocals = findDiff(serverSync.animations, localSync.animations);
            for (var i = 0; i < addLocals.length; i++) {
                var addLocal = addLocals[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientPull, addLocal._id, addLocal.localId));
            }
            var addRemotes = findDiff(localSync.animations, serverSync.animations);
            for (var i = 0; i < addRemotes.length; i++) {
                var addRemote = addRemotes[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientPush, addRemote._id, addRemote.localId));
            }
            defer.resolve(this.syncResult);
        }
        else if (this.localSync.dateModified > serverSync.dateModified) {
            this.log("Client is more current");
            var addRemotes = findDiff(localSync.animations, serverSync.animations);
            for (var i = 0; i < addRemotes.length; i++) {
                var addRemote = addRemotes[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientPush, addRemote._id, addRemote.localId));
            }
            var addLocals = findDiff(serverSync.animations, localSync.animations);
            for (var i = 0; i < addLocals.length; i++) {
                var addLocal = addLocals[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientPull, addLocal._id, addLocal.localId));
            }
            defer.resolve(this.syncResult);
        }
        else {
            this.log("Server and Client [UP TO DATE]");
            defer.resolve(this.syncResult);
        }
    };
    return Addition;
}(SyncProcess));
var Deletion = (function (_super) {
    __extends(Deletion, _super);
    function Deletion(syncResult, localSync) {
        _super.call(this, "Deletion", syncResult, localSync);
    }
    Deletion.prototype.doSync = function (defer, localSync, serverSync) {
        this.log("Deletion check");
        if (serverSync.dateModified > this.localSync.dateModified) {
            this.log("Server is more current");
            var deleteLocals = findDiff(localSync.animations, serverSync.animations);
            for (var i = 0; i < deleteLocals.length; i++) {
                var deleteLocal = deleteLocals[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientDelete, deleteLocal._id, deleteLocal.localId));
            }
            this.doServerDeletion(defer);
        }
        else if (this.localSync.dateModified > serverSync.dateModified) {
            this.log("Client is more current");
            var deleteRemotes = findDiff(serverSync.animations, localSync.animations);
            for (var i = 0; i < deleteRemotes.length; i++) {
                var deleteRemote = deleteRemotes[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ServerDelete, deleteRemote._id, deleteRemote.localId));
            }
            this.doServerDeletion(defer);
        }
        else {
            this.log("Server and Client [UP TO DATE]");
            defer.resolve(this.syncResult);
        }
    };
    Deletion.prototype.doServerDeletion = function (defer) {
        var _this = this;
        var deleteServerIds = [];
        for (var i = 0; i < this.syncResult.events.length; i++) {
            if (this.syncResult.events[i].action == SyncAction.ServerDelete) {
                deleteServerIds.push(this.syncResult.events[i].animationId.toString());
            }
        }
        if (deleteServerIds.length > 0) {
            animation_1.Animation.remove({ _id: { $in: deleteServerIds } }, function (err) {
                if (!err)
                    defer.reject(err);
                else
                    defer.resolve(_this.syncResult);
            });
        }
        else
            defer.resolve(this.syncResult);
    };
    return Deletion;
}(SyncProcess));
var Modification = (function (_super) {
    __extends(Modification, _super);
    function Modification(syncResult, localSync) {
        _super.call(this, "Modification", syncResult, localSync);
    }
    Modification.prototype.doSync = function (defer, localSync, serverSync) {
        this.log("DateModified check");
        for (var i = 0; i < serverSync.animations.length; i++) {
            var remote = serverSync.animations[i];
            var event_1 = new SyncEvent(SyncAction.Ok, remote._id, remote.localId);
            for (var j = 0; j < localSync.animations.length; j++) {
                var local = localSync.animations[j];
                if (remote._id == local._id) {
                    if (remote.dateModified > local.dateModified)
                        event_1.action = SyncAction.ClientPull;
                    else if (remote.dateModified < local.dateModified)
                        event_1.action = SyncAction.ClientPush;
                    break;
                }
            }
            if (event_1.action != SyncAction.Ok)
                this.syncResult.addSyncEvent(event_1);
        }
        defer.resolve(this.syncResult);
    };
    return Modification;
}(SyncProcess));
var Finalization = (function (_super) {
    __extends(Finalization, _super);
    function Finalization(syncResult, localSync) {
        _super.call(this, "ServerSyncUpdate", syncResult, localSync);
    }
    Finalization.prototype.doSync = function (defer, localSync, serverSync) {
        var _this = this;
        this.log('Updating ServerSync.dateModified');
        serverSync.clientId = localSync.clientId;
        serverSync.save(function (err, res) {
            if (err)
                defer.reject(err);
            else {
                defer.resolve(_this.syncResult);
                _this.log('ServerSync.clientId Updated');
            }
        });
    };
    return Finalization;
}(SyncProcess));
function findDiff(srcAnimations, targetAnimations) {
    var animations = [];
    for (var i = 0; i < srcAnimations.length; i++) {
        var found = false;
        for (var j = 0; j < targetAnimations.length; j++) {
            if (found = animEquals(srcAnimations[i], targetAnimations[j]))
                break;
        }
        if (!found)
            addAnimation(srcAnimations[i]);
    }
    function addAnimation(anim) {
        var found = false;
        for (var i = 0; i < animations.length; i++) {
            if (animations[i]._id == anim._id || animations[i].localId == anim.localId) {
                found = true;
                break;
            }
        }
        if (!found)
            animations.push(anim);
    }
    return animations;
}
function animEquals(anim, other) {
    if (anim == undefined || other == undefined)
        return false;
    return (anim._id == other._id || anim.localId == other.localId);
}
//# sourceMappingURL=synchronizer.js.map