"use strict";
var mailer = require('../libs/mailer');
var config = require('../configs/config');
var utils = require('../libs/utils');
var animation_1 = require('../models/animation');
var user_1 = require('../models/user');
var MAX_COUNT = 25;
function get(req, res, next) {
    return res.json(getServerInfo());
}
exports.get = get;
;
function listUsers(req, res, next) {
    var sort = createUserSort(req);
    var query = createQuery(req);
    var limit = utils.safeParseInt(req.query.limit) < MAX_COUNT ? utils.safeParseInt(req.query.limit) : MAX_COUNT;
    var skip = utils.safeParseInt(req.query.skip) < 0 ? 0 : utils.safeParseInt(req.query.skip);
    user_1.User.find(query).limit(limit).skip(skip).sort(sort).exec(function (err, result) {
        if (err)
            return next(err);
        return res.json(result);
    });
}
exports.listUsers = listUsers;
function listAnimations(req, res, next) {
    var sort = createAnimationSort(req);
    var query = createQuery(req);
    var limit = utils.safeParseInt(req.query.limit) < MAX_COUNT ? utils.safeParseInt(req.query.limit) : MAX_COUNT;
    var skip = utils.safeParseInt(req.query.skip) < 0 ? 0 : utils.safeParseInt(req.query.skip);
    animation_1.Animation.find(query).limit(limit).skip(skip).sort(sort).exec(function (err, result) {
        if (err)
            return next(err);
        res.json(result);
    });
}
exports.listAnimations = listAnimations;
;
function sendVerificationEmail(req, res, next) {
    user_1.User.findById(req.params._id, function (err, user) {
        if (err)
            return next(err);
        if (!user)
            return next(404);
        user.activation.hash = user.generateActivationHash();
        user.activation.timestamp = new Date();
        user.save();
        mailer.sendVerificationEmail(user)
            .then(function () { return res.sendStatus(200); })
            .catch(next);
    });
}
exports.sendVerificationEmail = sendVerificationEmail;
function sendResetEmail(req, res, next) {
    user_1.User.findById(req.params._id, function (err, user) {
        if (err)
            return next(err);
        if (!user)
            return next(404);
        user.activation.hash = user.generateActivationHash();
        user.activation.timestamp = new Date();
        user.save();
        mailer.sendResetEmail(user)
            .then(function () { return res.sendStatus(200); })
            .catch(next);
    });
}
exports.sendResetEmail = sendResetEmail;
function inactivateUser(req, res, next) {
    user_1.User.findById(req.params._id, function (err, user) {
        if (err)
            return next(err);
        if (!user)
            return next(404);
        user.active = false;
        user.activation.hash = null;
        user.activation.timestamp = null;
        user.save();
        res.status(200).send();
    });
}
exports.inactivateUser = inactivateUser;
function activateUser(req, res, next) {
    user_1.User.findById(req.params._id, function (err, user) {
        if (err)
            return next(err);
        if (!user)
            return next(404);
        user.active = true;
        user.activation.hash = null;
        user.activation.timestamp = null;
        user.save();
        res.status(200).send();
    });
}
exports.activateUser = activateUser;
;
////////////////////////////////////////////////////////////////////////////////////////////////////
function createUserSort(req) {
    var sort = {};
    if (req.query.sort === 'username')
        sort.username = -1;
    else if (req.query.sort === 'created')
        sort.createdDate = -1;
    sort._id = -1;
    return sort;
}
function createQuery(req) {
    var q = {};
    // search
    if (req.query.term) {
        if (req.query.term.indexOf('{') > -1) {
            q = JSON.parse(req.query.term);
        }
        else
            q.$text = { $search: req.query.term };
    }
    return q;
}
function createAnimationSort(req) {
    var sort = {};
    if (req.query.sort === 'rating')
        sort.rating = -1;
    else if (req.query.sort === 'views')
        sort.views = -1;
    else if (req.query.sort === 'newest')
        sort.dateModified = -1;
    sort._id = -1;
    return sort;
}
function getServerInfo() {
    var HIDDEN = '*******';
    var serverConfig = JSON.parse(JSON.stringify(config.setting));
    // hide all important values
    serverConfig.client.sessionSecret = HIDDEN;
    serverConfig.server.superSecret = HIDDEN;
    serverConfig.server.databaseUrl = HIDDEN;
    serverConfig.server.mailPassword = HIDDEN;
    serverConfig.auth.googleSecret = HIDDEN;
    serverConfig.auth.facebookSecret = HIDDEN;
    serverConfig.auth.disqusSecret = HIDDEN;
    serverConfig.auth.awsSecret = HIDDEN;
    return serverConfig;
}
//# sourceMappingURL=admin.js.map