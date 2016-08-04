"use strict";
var synchronizer_1 = require("../libs/synchronizer");
function sync(req, res, next) {
    var userId = req.user._id;
    var localSync = req.body;
    if (!localSync)
        return next(400);
    localSync.userId = userId;
    if (!localSync.animations || !localSync.clientId)
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
    var localSync = req.body.sync;
    var syncResult = req.body.result;
    if (!localSync || !syncResult)
        return next(400);
    var synchronizer = new synchronizer_1.Synchronizer(localSync);
    synchronizer.sync()
        .then(function () { return res.sendStatus(201); })
        .catch(function (err) { return next(err); });
}
exports.syncUpdate = syncUpdate;
//# sourceMappingURL=sync.js.map