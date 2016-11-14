"use strict";
var synchronizer_1 = require("../libs/synchronizer");
/**
 * Clients call this POST with LocalSync to get the result.
 * The result is a SyncResult object that tells client what to do (i.e: ClientPush, ClientPull, ClientDelete).
 *
 * After client has performed this action. Client should then call, syncUpdate() to update
 * the 'dateModified' field in the server side.
 */
function sync(req, res, next) {
    var localSync = req.body;
    var synchronizer = new synchronizer_1.Synchronizer(req.user, localSync);
    synchronizer.sync()
        .then(function (syncResult) { return res.send(syncResult); })
        .catch(function (err) { return next(err); });
}
exports.sync = sync;
/**
 * Client call this POST with LocalSync object to update 'dateModified' field on the server side.
 * The server remembers the 'clientId' (from LocalSync object) to match up the sync.
 * If everything goes well, the server will update the dateModified field
 */
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