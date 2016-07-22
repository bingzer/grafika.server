"use strict";
var user_animation_1 = require('../models/user-animation');
var animation_1 = require('../models/animation');
(function (SyncAction) {
    SyncAction[SyncAction["Ok"] = 0] = "Ok";
    SyncAction[SyncAction["ClientPull"] = 1] = "ClientPull";
    SyncAction[SyncAction["ClientPush"] = 2] = "ClientPush";
    SyncAction[SyncAction["ClientDelete"] = 3] = "ClientDelete";
})(exports.SyncAction || (exports.SyncAction = {}));
var SyncAction = exports.SyncAction;
var SyncEvent = (function () {
    function SyncEvent() {
    }
    return SyncEvent;
}());
exports.SyncEvent = SyncEvent;
var SyncResult = (function () {
    function SyncResult() {
        this.events = [];
    }
    return SyncResult;
}());
exports.SyncResult = SyncResult;
var Synchronizer = (function () {
    function Synchronizer(localUserAnim) {
        this.syncResult = new SyncResult();
        this.localUserAnim = localUserAnim;
        this.localAnimations = localUserAnim.animations;
    }
    Synchronizer.prototype.sync = function (callback) {
        var _this = this;
        user_animation_1.UserAnimation.findById(this.localUserAnim._id, function (err, remoteUserAnim) {
            if (err)
                return callback(err, _this.syncResult);
            _this.remoteUserAnim = remoteUserAnim;
            animation_1.Animation.find({ _id: { $in: remoteUserAnim.animationIds } }, function (err, remoteAnimations) {
                if (err)
                    return callback(err, _this.syncResult);
                _this.remoteAnimations = remoteAnimations;
                _this.checkDateModified();
                _this.checkDeleted();
                callback(err, _this.syncResult);
            });
        });
    };
    Synchronizer.prototype.checkDateModified = function () {
        for (var i = 0; i < this.remoteAnimations.length; i++) {
            var event_1 = new SyncEvent();
            var remote = this.remoteAnimations[i];
            event_1.animationId = remote._id;
            event_1.action = SyncAction.Ok;
            event_1.localId = remote.localId;
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
        if (this.remoteUserAnim.dateModified > this.localUserAnim.dateModified) {
            for (var i = 0; i < this.remoteUserAnim.animationIds.length; i++) {
                var remoteAnim = this.remoteUserAnim.animationIds[i];
                var event_2 = new SyncEvent();
                event_2.animationId = remoteAnim;
                event_2.action = SyncAction.Ok;
                var foundLocal = false;
                for (var j = 0; j < this.localAnimations.length; j++) {
                    var localAnim = this.localAnimations[j];
                    if (remoteAnim === localAnim._id) {
                        event_2.localId = localAnim.localId;
                        foundLocal = true;
                        break;
                    }
                }
                if (!foundLocal) {
                    event_2.action = SyncAction.ClientPull;
                }
                if (event_2.action != SyncAction.Ok)
                    this.syncResult.events.push(event_2);
            }
        }
        else if (this.remoteUserAnim.dateModified < this.localUserAnim.dateModified) {
            for (var i = 0; i < this.localAnimations.length; i++) {
                var localAnim = this.localAnimations[i];
                var event_3 = new SyncEvent();
                event_3.animationId = localAnim._id;
                event_3.action = SyncAction.Ok;
                event_3.localId = localAnim.localId;
                var foundRemote = false;
                for (var j = 0; j < this.remoteUserAnim.animationIds.length; j++) {
                    var remoteAnim = this.remoteUserAnim.animationIds[j];
                    if (localAnim._id === remoteAnim) {
                        foundRemote = true;
                        break;
                    }
                }
                if (!foundRemote) {
                    event_3.action = SyncAction.ClientPush;
                }
                if (event_3.action != SyncAction.Ok)
                    this.syncResult.events.push(event_3);
            }
        }
    };
    return Synchronizer;
}());
exports.Synchronizer = Synchronizer;
//# sourceMappingURL=synchronizer.js.map