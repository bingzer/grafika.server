"use strict";
var user_1 = require("../models/user");
function get(req, res, next) {
    var userId = req.params._id;
    var sameUser = (req.user && req.user._id.toString() == userId);
    var isAdmin = user_1.isAdministrator(req.user);
    user_1.User.findById(userId, function (err, user) {
        if (!user)
            err = 404;
        if (err)
            return next(err);
        user = user.sanitize();
        if (!sameUser && !isAdmin)
            delete user.email;
        res.send(user);
    });
}
exports.get = get;
function update(req, res, next) {
    if (!req.body || !req.params._id)
        return next();
    var userId = req.params._id;
    var user = { email: req.user.email, dateModified: Date.now() };
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
function getAvatar(req, res, next) {
    user_1.User.findOne(req.params._id, function (err, user) {
        if (err)
            return next(err);
        if (!user)
            return next(404);
        res.redirect(user.prefs.avatar);
    });
}
exports.getAvatar = getAvatar;
;
//# sourceMappingURL=users.js.map