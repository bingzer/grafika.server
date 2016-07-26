"use strict";
var user_1 = require("../models/user");
function get(req, res, next) {
    var userId = req.params._id;
    user_1.User.findById(userId, function (err, user) {
        if (!user)
            err = 404;
        if (err)
            return next(err);
        res.send(user_1.sanitize(user));
    });
}
exports.get = get;
function update(req, res, next) {
    if (!req.body || !req.params._id)
        return next();
    var userId = req.params._id;
    var user = { dateModified: Date.now() };
    if (req.body.lastName)
        user.lastName = req.body.lastName;
    if (req.body.firstName)
        user.firstName = req.body.firstName;
    if (req.body.username)
        user.username = req.body.username;
    if (req.body.prefs) {
        user.prefs = {};
        if (req.body.prefs.playbackLoop)
            user.prefs.playbackLoop = req.body.prefs.playbackLoop;
        if (req.body.prefs.drawingTimer)
            user.prefs.drawingTimer = req.body.prefs.drawingTimer;
        if (req.body.prefs.drawingIsPublic)
            user.prefs.drawingIsPublic = req.body.prefs.drawingIsPublic;
    }
    user_1.checkAvailability(user).then(function () {
        user_1.User.findOneAndUpdate({ _id: userId }, user, function (err, user) {
            if (!user)
                err = 404;
            if (err)
                return next(err);
            res.sendStatus(200);
        });
    }, function (error) { return next(error); });
}
exports.update = update;
//# sourceMappingURL=users.js.map