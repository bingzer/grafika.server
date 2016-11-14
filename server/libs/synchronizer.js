"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('underscore');
var q = require('q');
var winston = require('winston');
var sync_1 = require('../models/sync');
var animation_1 = require('../models/animation');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Synchronizer = (function () {
    function Synchronizer(user, localSync) {
        this.user = user;
        this.localSync = localSync;
        // do nothing
    }
    Synchronizer.prototype.sync = function () {
        var _this = this;
        var result = new SyncResult(this.localSync.clientId);
        var preparation = new Preparation(this.user, result);
        var addition = new Addition(this.user, result);
        var modification = new Modification(this.user, result);
        var deletion = new Deletion(this.user, result);
        var finalization = new Finalization(this.user, result);
        return sync_1.ServerSync.find(this.localSync.userId)
            .then(function (serverSync) {
            return preparation.sync(_this.localSync, serverSync)
                .then(function (result) { return addition.sync(_this.localSync, serverSync); })
                .then(function (result) { return modification.sync(_this.localSync, serverSync); })
                .then(function (result) { return deletion.sync(_this.localSync, serverSync); })
                .then(function (result) { return finalization.sync(_this.localSync, serverSync); });
        });
    };
    Synchronizer.prototype.syncUpdate = function (syncResult) {
        var _this = this;
        var defer = q.defer();
        var preparation = new Preparation(this.user, syncResult);
        var finalization = new FinalizationForUpdate(this.user, syncResult);
        return sync_1.ServerSync.find(this.localSync.userId)
            .then(function (serverSync) {
            return preparation.sync(_this.localSync, serverSync)
                .then(function (result) { return finalization.sync(_this.localSync, serverSync); });
        });
    };
    return Synchronizer;
}());
exports.Synchronizer = Synchronizer;
var InternalSyncProcess = (function () {
    function InternalSyncProcess(user, syncResult) {
        this.user = user;
        this.syncResult = syncResult;
        // nothing
    }
    InternalSyncProcess.prototype.sync = function (localSync, serverSync) {
        var _this = this;
        var defer = q.defer();
        q.delay(100).then(function () {
            try {
                _this.executeSync(localSync, serverSync);
                defer.resolve(_this.syncResult);
            }
            catch (e) {
                defer.reject(e);
            }
        });
        return defer.promise;
    };
    return InternalSyncProcess;
}());
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Preparation = (function (_super) {
    __extends(Preparation, _super);
    function Preparation(user, syncResult) {
        _super.call(this, user, syncResult);
    }
    Preparation.prototype.executeSync = function (localSync, serverSync) {
        log("Preparation");
        this.validateUser(this.user);
        this.validateLocalSync(localSync);
        this.validateSyncResult(this.syncResult);
        log("\tuserId   : " + this.user._id);
        log("\tclientId : " + localSync.clientId);
    };
    Preparation.prototype.validateUser = function (user) {
        if (!this.user)
            throw new Error("User is required");
    };
    Preparation.prototype.validateLocalSync = function (localSync) {
        if (!localSync)
            throw new Error("LocalSync is requred");
        if (!localSync.userId)
            throw new Error("LocalSync.userId is requried");
        if (!localSync.clientId)
            throw new Error("LocalSync.clientId is requried");
        if (!localSync.animations && localSync.animations.length > 0)
            throw new Error("LocalSync.animations is requried");
        if (!localSync.tombstones && localSync.tombstones.length > 0)
            throw new Error("LocalSync.tombstones is requried");
        if (this.user._id !== localSync.userId)
            throw new Error("LocalSync.userId does not match");
    };
    Preparation.prototype.validateSyncResult = function (syncResult) {
        if (!syncResult)
            throw new Error("SyncResult is required");
        if (!syncResult.clientId)
            throw new Error("SyncResult.clientId is required");
        if (!syncResult.syncDate)
            throw new Error("SyncResult.syncDate is required");
    };
    return Preparation;
}(InternalSyncProcess));
var Modification = (function (_super) {
    __extends(Modification, _super);
    function Modification(user, syncResult) {
        _super.call(this, user, syncResult);
    }
    Modification.prototype.executeSync = function (localSync, serverSync) {
        log("Modification");
        for (var i = 0; i < localSync.animations.length; i++) {
            var localAnim = localSync.animations[i];
            for (var j = 0; j < serverSync.animations.length; j++) {
                var serverAnim = serverSync.animations[j];
                if (animEquals(localAnim, serverAnim)) {
                    if (localAnim.dateModified < serverAnim.dateModified)
                        this.syncResult.addAction(SyncAction.ClientOutOfDate, localAnim);
                    if (localAnim.dateModified > serverAnim.dateModified)
                        this.syncResult.addAction(SyncAction.ServerOutOfDate, localAnim);
                    break;
                }
            } // end j
        } // end i
    };
    return Modification;
}(InternalSyncProcess));
var Deletion = (function (_super) {
    __extends(Deletion, _super);
    function Deletion(user, syncResult) {
        _super.call(this, user, syncResult);
    }
    Deletion.prototype.executeSync = function (localSync, serverSync) {
        log("Deletion");
        // Local deletions
        for (var i = 0; i < localSync.tombstones.length; i++) {
            var localAnim = localSync.tombstones[i];
            for (var j = 0; j < serverSync.animations.length; j++) {
                var serverAnim = serverSync.animations[j];
                if (animEquals(localAnim, serverAnim)) {
                    this.syncResult.addAction(SyncAction.ServerDelete, serverAnim);
                    break;
                }
            }
        } // end i
        // server deletions
        for (var i = 0; i < serverSync.tombstones.length; i++) {
            var serverAnim = serverSync.tombstones[i];
            for (var j = 0; j < localSync.animations.length; j++) {
                var localAnim = localSync.animations[j];
                if (animEquals(localAnim, serverAnim)) {
                    this.syncResult.addAction(SyncAction.ClientDelete, localAnim);
                    break;
                }
            }
        }
    };
    return Deletion;
}(InternalSyncProcess));
var Addition = (function (_super) {
    __extends(Addition, _super);
    function Addition(user, syncResult) {
        _super.call(this, user, syncResult);
    }
    Addition.prototype.executeSync = function (localSync, serverSync) {
        log("Addition");
        // local addition
        for (var i = 0; i < localSync.animations.length; i++) {
            var localAnim = localSync.animations[i];
            var serverMissing = true;
            for (var j = 0; j < serverSync.animations.length; j++) {
                var serverAnim = serverSync.animations[j];
                if (animEquals(localAnim, serverAnim)) {
                    serverMissing = false;
                    break;
                }
            } // end j
            for (var j = 0; j < serverSync.tombstones.length; j++) {
                var serverAnim = serverSync.tombstones[j];
                if (animEquals(localAnim, serverAnim)) {
                    serverMissing = false;
                    break;
                }
            } // end j
            if (serverMissing) {
                this.syncResult.addAction(SyncAction.ServerMissing, localAnim);
            }
        } // end i
        // server addition
        for (var i = 0; i < serverSync.animations.length; i++) {
            var serverAnim = serverSync.animations[i];
            var clientMissing = true;
            for (var j = 0; j < localSync.animations.length; j++) {
                var localAnim = localSync.animations[j];
                if (animEquals(localAnim, serverAnim)) {
                    clientMissing = false;
                    break;
                }
            }
            for (var j = 0; j < localSync.tombstones.length; j++) {
                var localAnim = localSync.tombstones[j];
                if (animEquals(localAnim, serverAnim)) {
                    clientMissing = false;
                    break;
                }
            }
            if (clientMissing) {
                this.syncResult.addAction(SyncAction.ClientMissing, serverAnim);
            }
        } // end i
    };
    return Addition;
}(InternalSyncProcess));
var Finalization = (function (_super) {
    __extends(Finalization, _super);
    function Finalization(user, syncResult) {
        _super.call(this, user, syncResult);
    }
    Finalization.prototype.executeSync = function (localSync, serverSync) {
        log("Finalization");
        log(this.syncResult.display());
    };
    return Finalization;
}(InternalSyncProcess));
var FinalizationForUpdate = (function (_super) {
    __extends(FinalizationForUpdate, _super);
    function FinalizationForUpdate(user, syncResult) {
        _super.call(this, user, syncResult);
    }
    FinalizationForUpdate.prototype.sync = function (localSync, serverSync) {
        var defer = q.defer();
        // handles all delete
        var serverDeleteEvents = _.filter(this.syncResult.events, function (event) { return event.action == SyncAction.ServerDelete; });
        var serverDeleteIds = _.map(serverDeleteEvents, function (event) { return event.animationId; });
        animation_1.Animation.remove({ _id: { $in: serverDeleteIds } }, function (err) {
            if (err)
                defer.reject(err);
            else
                defer.resolve();
        });
        return defer.promise;
    };
    return FinalizationForUpdate;
}(Finalization));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function (SyncAction) {
    /**
     * Nothing to be done
     */
    SyncAction[SyncAction["Ok"] = 0] = "Ok";
    /**
     * Client needs to pull and update
     */
    SyncAction[SyncAction["ClientOutOfDate"] = 1] = "ClientOutOfDate";
    /**
     * Clients needs to create and then pull for update
     */
    SyncAction[SyncAction["ClientMissing"] = 2] = "ClientMissing";
    /**
     * Clients should delete its animation
     */
    SyncAction[SyncAction["ClientDelete"] = 3] = "ClientDelete";
    /**
     * Server is missing this animation
     */
    SyncAction[SyncAction["ServerMissing"] = 4] = "ServerMissing";
    /**
     * Server is out of date. Needs to be updated
     */
    SyncAction[SyncAction["ServerOutOfDate"] = 5] = "ServerOutOfDate";
    /**
     * Server needs to delete the animation
     */
    SyncAction[SyncAction["ServerDelete"] = 6] = "ServerDelete";
})(exports.SyncAction || (exports.SyncAction = {}));
var SyncAction = exports.SyncAction;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var SyncEvent = (function () {
    function SyncEvent(action, animationId, localId) {
        this.action = action;
        this.animationId = animationId;
        this.localId = localId;
        // nothing
    }
    SyncEvent.prototype.display = function () {
        var str = '';
        switch (this.action) {
            case SyncAction.Ok:
                str += "[Ok]";
                break;
            case SyncAction.ClientDelete:
                str += "[ClientDelete]";
                break;
            case SyncAction.ClientOutOfDate:
                str += "[ClientOutOfDate]";
                break;
            case SyncAction.ClientMissing:
                str += "[ClientMissing]";
                break;
            case SyncAction.ServerDelete:
                str += "[ServerDelete]";
                break;
            case SyncAction.ServerOutOfDate:
                str += "[ServerOutOfDate]";
                break;
            case SyncAction.ServerMissing:
                str += "[ServerMissing]";
                break;
            default:
                str += "[Unknown]";
                break;
        }
        str += ' -> SyncEvent { action:' + this.action + ', localId:' + (this.localId || '[undefined]') + ', _id:' + (this.animationId || '[undefined]') + ' }';
        return str;
    };
    return SyncEvent;
}());
exports.SyncEvent = SyncEvent;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var SyncResult = (function () {
    function SyncResult(clientId) {
        /**
         * Sync date
         */
        this.syncDate = Date.now();
        /**
         * Collections of events need to be done
         */
        this.events = [];
        this.clientId = clientId;
    }
    SyncResult.prototype.addAction = function (action, animation) {
        for (var i = 0; i < this.events.length; i++) {
            if (this.events[i].animationId == animation._id && this.events[i].localId == animation.localId)
                return;
        }
        this.events.push(new SyncEvent(action, animation._id, animation.localId));
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
function log(msg) {
    winston.info('[Sync] ' + msg);
}
function animEquals(anim, other) {
    return anim._id == other._id || anim.localId == other.localId;
}
//# sourceMappingURL=synchronizer.js.map