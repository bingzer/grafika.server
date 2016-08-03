"use strict";
var sync_1 = require("../models/sync");
var synchronizer_1 = require("../libs/synchronizer");
function sync(req, res, next) {
    var userId = req.user._id;
    var localSync = req.body;
    if (!localSync)
        return next(400);
    localSync._id = userId;
    if (!localSync.animations || !localSync.dateModified || !localSync.clientId)
        return next(400);
    var synchronizer = new synchronizer_1.Synchronizer(localSync);
    synchronizer
        .sync()
        .then(function (syncResult) {
        res.send(syncResult);
    })
        .catch(function (err) {
        next(err);
    });
}
exports.sync = sync;
function syncUpdate(req, res, next) {
    var userId = req.user._id;
    var localSync = req.body;
    if (!localSync)
        return next(400);
    localSync._id = userId;
    sync_1.Sync.findOne({ _id: localSync._id, $or: [{ clientId: localSync.clientId }, { clientId: null }] }, function (err, result) {
        if (err)
            next(result);
        else if (!result) {
            next('Unable to find ServerSync. Detail: ' + err);
        }
        else {
            var match_1 = result.clientId === localSync.clientId;
            if (result.clientId)
                result.dateModified = localSync.dateModified;
            result.clientId = undefined;
            result.save(function (err) {
                if (err)
                    next(err);
                else if (!match_1)
                    next('No matching clientId found');
                else
                    res.sendStatus(201);
            });
        }
    });
}
exports.syncUpdate = syncUpdate;
//# sourceMappingURL=sync.js.map