"use strict";
var synchronizer_1 = require("../libs/synchronizer");
function sync(req, res, next) {
    var userId = req.user._id;
    var localUserAnim = req.body.userAnimation;
    if (!localUserAnim)
        return next(400);
    localUserAnim._id = userId;
    var synchronizer = new synchronizer_1.Synchronizer(localUserAnim);
    synchronizer.sync(function (err, syncResult) {
        if (err)
            return next(err);
        res.send(syncResult);
    });
}
exports.sync = sync;
//# sourceMappingURL=sync.js.map