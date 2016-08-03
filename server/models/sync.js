"use strict";
var mongoose = require('mongoose');
var restful = require('../libs/restful');
exports.SyncSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    animationIds: { type: [String] },
    dateModified: Number,
    dateCreated: Number,
    clientId: String
});
var Sync = restful.model('sync', exports.SyncSchema);
exports.Sync = Sync;
function createOrUpdateSync(userId, animationId, callback) {
    Sync.findById(userId, function (err, serverSync) {
        if (!serverSync) {
            var sync = { _id: new mongoose.Types.ObjectId(userId.toString()), animationIds: [animationId], dateModified: Date.now(), dateCreated: Date.now() };
            Sync.create(sync, function (err, res) { return callback(err, res); });
        }
        else {
            if (!err) {
                var found = false;
                for (var i = 0; i < serverSync.animationIds.length; i++) {
                    if (serverSync.animationIds[i] == animationId) {
                        found = true;
                        break;
                    }
                }
                if (!found)
                    serverSync.animationIds.push(animationId);
                serverSync.dateModified = Date.now();
                serverSync.save();
            }
            callback(err, serverSync);
        }
    });
}
exports.createOrUpdateSync = createOrUpdateSync;
function deleteSync(userId, animationId, callback) {
    Sync.findById(userId, function (err, sync) {
        var i = 0;
        for (; i < sync.animationIds.length; i++) {
            if (sync.animationIds[i] == animationId) {
                break;
            }
        }
        sync.animationIds.splice(i, 1);
        sync.dateModified = Date.now();
        sync.save();
        callback(err);
    });
}
exports.deleteSync = deleteSync;
//# sourceMappingURL=sync.js.map