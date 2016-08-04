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
var Synchronizer = (function () {
    function Synchronizer(localSync) {
        this.localSync = localSync;
    }
    Synchronizer.prototype.sync = function () {
        var _this = this;
        var result = new SyncResult(this.localSync.clientId);
        var preparation = new Preparation(result);
        var addition = new Addition(result);
        var modification = new Modification(result);
        var deletion = new Deletion(result);
        var finalization = new Finalization(result);
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
        var defer = q.defer();
        var serverDeleteEvents = _.filter(syncResult.events, function (event) { return event.action === SyncAction.ServerDelete; });
        var serverDeleteIds = _.map(syncResult.events, function (event) { return event.animationId; });
        animation_1.Animation.remove({ _id: { $in: serverDeleteIds } }, function (err) {
            if (err)
                defer.reject(err);
            else
                defer.resolve();
        });
        return defer.promise;
    };
    return Synchronizer;
}());
exports.Synchronizer = Synchronizer;
var InternalSyncProcess = (function () {
    function InternalSyncProcess(syncResult) {
        this.syncResult = syncResult;
    }
    InternalSyncProcess.prototype.sync = function (localSync, serverSync) {
        var _this = this;
        var defer = q.defer();
        q.delay(500).then(function () {
            try {
                _this.executeSync(localSync, serverSync);
                q.resolve(_this.syncResult);
            }
            catch (e) {
                q.reject(e);
            }
        });
        return defer.promise;
    };
    return InternalSyncProcess;
}());
var Preparation = (function (_super) {
    __extends(Preparation, _super);
    function Preparation(syncResult) {
        _super.call(this, syncResult);
    }
    Preparation.prototype.executeSync = function (localSync, serverSync) {
        log("Preparation");
    };
    return Preparation;
}(InternalSyncProcess));
var Modification = (function (_super) {
    __extends(Modification, _super);
    function Modification(syncResult) {
        _super.call(this, syncResult);
    }
    Modification.prototype.executeSync = function (localSync, serverSync) {
        log("Modification");
        for (var i = 0; i < localSync.animations.length; i++) {
            var localAnim = localSync.animations[i];
            for (var j = 0; j < serverSync.animations.length; j++) {
                var serverAnim = serverSync.animations[j];
                if (localAnim._id == serverAnim._id) {
                    if (localAnim.dateModified < serverAnim.dateModified)
                        this.syncResult.addAction(SyncAction.ClientOutOfDate, localAnim);
                    if (localAnim.dateModified > serverAnim.dateModified)
                        this.syncResult.addAction(SyncAction.ServerOutOfDate, localAnim);
                    break;
                }
            }
        }
    };
    return Modification;
}(InternalSyncProcess));
var Deletion = (function (_super) {
    __extends(Deletion, _super);
    function Deletion(syncResult) {
        _super.call(this, syncResult);
    }
    Deletion.prototype.executeSync = function (localSync, serverSync) {
        log("Deletion");
        for (var i = 0; i < localSync.tombstones.length; i++) {
            var localAnim = localSync.animations[i];
            for (var j = 0; j < serverSync.animations.length; j++) {
                var serverAnim = serverSync.animations[j];
                if (localAnim._id == serverAnim._id) {
                    this.syncResult.addAction(SyncAction.ServerDelete, serverAnim);
                    break;
                }
            }
        }
        for (var i = 0; i < serverSync.tombstones.length; i++) {
            var localAnim = localSync.animations[i];
            for (var j = 0; j < localSync.animations.length; j++) {
                var serverAnim = serverSync.animations[j];
                if (localAnim._id == serverAnim._id) {
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
    function Addition(syncResult) {
        _super.call(this, syncResult);
    }
    Addition.prototype.executeSync = function (localSync, serverSync) {
        log("Addition");
        for (var i = 0; i < localSync.animations.length; i++) {
            var localAnim = localSync.animations[i];
            var serverMissing = true;
            for (var j = 0; j < serverSync.animations.length; j++) {
                var serverAnim = serverSync.animations[j];
                if (localAnim._id == serverAnim._id) {
                    serverMissing = false;
                    break;
                }
            }
            if (serverMissing) {
                this.syncResult.addAction(SyncAction.ServerMissing, localAnim);
            }
        }
        for (var i = 0; i < serverSync.animations.length; i++) {
            var serverAnim = serverSync.animations[i];
            var clientMissing = true;
            for (var j = 0; j < localSync.animations.length; j++) {
                var localAnim = localSync.animations[j];
                if (serverAnim._id == localAnim._id) {
                    clientMissing = false;
                    break;
                }
            }
            if (clientMissing) {
                this.syncResult.addAction(SyncAction.ClientMissing, serverAnim);
            }
        }
    };
    return Addition;
}(InternalSyncProcess));
var Finalization = (function (_super) {
    __extends(Finalization, _super);
    function Finalization(syncResult) {
        _super.call(this, syncResult);
    }
    Finalization.prototype.executeSync = function (localSync, serverSync) {
        log("Finalization");
    };
    return Finalization;
}(InternalSyncProcess));
(function (SyncAction) {
    SyncAction[SyncAction["Ok"] = 0] = "Ok";
    SyncAction[SyncAction["ClientOutOfDate"] = 1] = "ClientOutOfDate";
    SyncAction[SyncAction["ClientMissing"] = 2] = "ClientMissing";
    SyncAction[SyncAction["ClientDelete"] = 3] = "ClientDelete";
    SyncAction[SyncAction["ServerMissing"] = 4] = "ServerMissing";
    SyncAction[SyncAction["ServerOutOfDate"] = 5] = "ServerOutOfDate";
    SyncAction[SyncAction["ServerDelete"] = 6] = "ServerDelete";
})(exports.SyncAction || (exports.SyncAction = {}));
var SyncAction = exports.SyncAction;
var SyncEvent = (function () {
    function SyncEvent(action, animationId) {
        this.action = action;
        this.animationId = animationId;
    }
    SyncEvent.prototype.display = function () {
        var str = 'Action=' + this.action + ' ';
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
            case SyncAction.ServerDelete:
                str += "[ServerDelete]";
                break;
            default:
                str += "[Unknown]";
                break;
        }
        str += ' AnimationId=' + this.animationId;
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
    SyncResult.prototype.addAction = function (action, animation) {
        for (var i = 0; i < this.events.length; i++) {
            if (this.events[i].animationId == animation._id)
                return;
        }
        this.events.push(new SyncEvent(action, animation._id));
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
    winston.info('[Sync]' + msg);
}
//# sourceMappingURL=synchronizer.js.map