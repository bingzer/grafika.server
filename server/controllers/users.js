"use strict";
var aws_1 = require('../libs/aws');
var user_1 = require("../models/user");
var aws = new aws_1.AwsUsers();
function get(req, res, next) {
    var userId = req.params._id;
    var isAdmin = user_1.isAdministrator(req.user);
    user_1.User.findById(userId, function (err, user) {
        if (!user)
            err = 404;
        if (err)
            return next(err);
        user = user.sanitize();
        if (!req.user || ((req.user && req.user._id.toString() !== user._id.toString()) && !isAdmin))
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
        if (req.body.prefs.avatar)
            user.prefs.avatar = req.body.prefs.avatar;
        if (req.body.prefs.backdrop)
            user.prefs.backdrop = req.body.prefs.backdrop;
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
    user_1.User.findById(req.params._id, function (err, user) {
        if (err)
            return next(err);
        if (!user)
            return res.redirect('/assets/img/ic_user.png');
        res.redirect(user.prefs.avatar);
    });
}
exports.getAvatar = getAvatar;
;
function createAvatarSignedUrl(req, res, next) {
    var userId = req.user._id;
    var mimeType = req.body.mime;
    var imageType = req.body.imageType;
    if (!userId || !mimeType || !imageType)
        return next("User, ImageType or Mime type must be specified in the request body");
    user_1.User.findById(userId, function (err, user) {
        if (err)
            return next(err);
        else if (!user)
            return next(404);
        aws.createSignedUrl(user, imageType, mimeType)
            .then(function (signedUrl) { return res.send(signedUrl); })
            .catch(next);
    });
}
exports.createAvatarSignedUrl = createAvatarSignedUrl;
;
//# sourceMappingURL=users.js.map