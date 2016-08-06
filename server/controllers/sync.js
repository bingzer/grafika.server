"use strict";
var synchronizer_1 = require("../libs/synchronizer");
function sync(req, res, next) {
    var localSync = req.body;
    var synchronizer = new synchronizer_1.Synchronizer(req.user, localSync);
    synchronizer.sync()
        .then(function (syncResult) { return res.send(syncResult); })
        .catch(function (err) { return next(err); });
}
exports.sync = sync;
function syncUpdate(req, res, next) {
    var localSync = req.body.sync;
    var syncResult = req.body.result;
    var synchronizer = new synchronizer_1.Synchronizer(req.user, localSync);
    if (!localSync || !syncResult)
        return next(new Error("sync and/ result are required"));
    synchronizer.syncUpdate(syncResult)
        .then(function () { return res.sendStatus(201); })
        .catch(function (err) { return next(err); });
}
exports.syncUpdate = syncUpdate;
//# sourceMappingURL=sync.js.map