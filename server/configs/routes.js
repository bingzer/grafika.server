"use strict";
var expressJwt = require("express-jwt");
var mongoose = require("mongoose");
var winston = require("winston");
var serverController = require("../controllers/server");
var accountController = require("../controllers/accounts");
var resourcesController = require("../controllers/resources");
var userController = require("../controllers/users");
var syncController = require("../controllers/sync");
var adminController = require("../controllers/admin");
var animationController = require("../controllers/animation");
var contentController = require("../controllers/content");
var config = require("../configs/config");
var animation_1 = require("../models/animation");
var user_1 = require("../models/user");
//////////////////////////////////////////////////////////////////////////////////////////////////
var SECRET = config.setting.$server.$superSecret;
/** find token from Http Request. Header/Query, etc... */
function findToken(req) {
    if (req.headers['authorization'] && req.headers['authorization'].split(' ')[0] === 'Bearer')
        return req.headers['authorization'].split(' ')[1];
    else if (req.query && req.query.token)
        return req.query.token;
    else if (req.cookies && req.cookies.token)
        return req.cookies.token;
    return null;
}
/** Make sure is logged in via session */
function useSession(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    else
        res.sendStatus(401);
}
;
function extractUser(req, res, next) {
    if (!req.isAuthenticated())
        expressJwt({ secret: SECRET, credentialsRequired: false, getToken: findToken })(req, res, next);
    else
        next();
}
/** Authenticate using jwt token */
function useJwt(req, res, next) {
    return expressJwt({ secret: SECRET, getToken: findToken })(req, res, next);
}
;
/** Authenticate using jwt token only if it's not authenticated yet */
function useSessionOrJwt(req, res, next) {
    if (!req.isAuthenticated())
        return expressJwt({ secret: SECRET, getToken: findToken })(req, res, next);
    else
        next();
}
/** Check animation access */
function useAnimAccess(req, res, next) {
    var animId = new mongoose.Types.ObjectId(req.params._id || req.params.animationId);
    var userId = (req.user && req.user._id) ? new mongoose.Types.ObjectId(req.user._id) : undefined;
    var queryAdmin = null;
    var query = null;
    var isAdmin = user_1.isAdministrator(req.user);
    if (isAdmin) {
        queryAdmin = { _id: animId };
    }
    else {
        query = { $or: [
                { $and: [{ _id: animId }, { userId: userId }] },
                { $and: [{ _id: animId }, { isPublic: true }] }
            ] };
    }
    return animation_1.Animation.findOne(query || queryAdmin, { _id: 1, userId: 1 }, function (err, result) {
        if (err)
            return next(err);
        if (result) {
            // Enforce for READ-ONLY access
            // only that user and an administrator can do PUT/POST/DELETE
            // others can only GET 
            if (req.method != 'GET') {
                // comapre the user id
                if (!userId || result.userId.toString() !== userId.toString() && !isAdmin) {
                    return next(401);
                }
            }
            return next();
        }
        else
            return next(401); // not authorized
    });
}
function useAdminAccess(req, res, next) {
    if (!user_1.isAdministrator(req.user))
        return next(401);
    return next();
}
function handleErrors(err, req, res, next) {
    if (err) {
        var status_1 = 500;
        var msg = undefined;
        var stack = err.stack;
        delete err.stack;
        if (typeof err == 'number')
            status_1 = err;
        else if (typeof err == 'string') {
            status_1 = 400;
            msg = err;
        }
        else if (err) {
            if (err.status) {
                status_1 = err.status;
                msg = err.msg || err.message;
            }
            else if (err.msg || err.message) {
                status_1 = 400;
                msg = err.msg || err.message;
            }
            else {
                status_1 = 400;
            }
        }
        else {
            msg = 'This is our fault, will be checking on this';
        }
        res.status(status_1).send(msg);
        winston.error('HTTP Error. Status Code=' + status_1 + (msg ? '  msg=' + msg : ''), stack);
    }
    else
        next();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initialize(app) {
    app.use(extractUser);
    app.get('/', serverController.getInfo);
    app.get('/accounts/google', accountController.googleLogin);
    app.get('/accounts/google/callback', accountController.googleCallback, accountController.providerLogin);
    app.get('/accounts/facebook', accountController.facebookLogin);
    app.get('/accounts/facebook/callback', accountController.facebookCallback, accountController.providerLogin);
    app.get('/accounts/disqus', useSessionOrJwt, accountController.disqusToken);
    app.post('/accounts', accountController.login);
    app.post('/accounts/logout', accountController.logout);
    app.post('/accounts/authenticate', accountController.authenticate);
    app.post('/accounts/authenticate/google', accountController.authenticateGoogle, accountController.authenticate);
    app.post('/accounts/authenticate/facebook', accountController.authenticateFacebook, accountController.authenticate);
    app.post('/accounts/register', accountController.register);
    app.post('/accounts/pwd/reset', accountController.resetPassword);
    app.post('/accounts/pwd', useSessionOrJwt, accountController.changePassword);
    app.post('/accounts/username-check', useSessionOrJwt, accountController.checkUsernameAvailability);
    // ---------------- Animation -----------------------------//
    app.get('/animations', animationController.search);
    app.get('/animations/random', animationController.getRandomAnimation);
    app.post('/animations', useSessionOrJwt); // create
    app.get('/animations/:_id', useAnimAccess); // view
    app.put('/animations/:_id', useSessionOrJwt, useAnimAccess); // update
    app.delete('/animations/:_id', useSessionOrJwt, useAnimAccess, animationController.remove); // delete
    app.get('/animations/:_id/frames', useAnimAccess); // get frames
    app.post('/animations/:_id/frames', useSessionOrJwt, useAnimAccess);
    app.post('/animations/:_id/view', animationController.incrementViewCount);
    app.post('/animations/:_id/rating/:rating', animationController.submitRating);
    app.get('/animations/:_id/seo', useAnimAccess, animationController.seo);
    // --------------- Sync Stuffs -------------------------//
    app.get('/animations/:_id/comments', animationController.commentForMobile);
    app.post('/animations/:_id/comments', useSessionOrJwt, animationController.postComment);
    // --------------- Sync Stuffs -------------------------//
    app.post('/animations/sync', useSessionOrJwt, syncController.sync);
    app.post('/animations/sync/update', useSessionOrJwt, syncController.syncUpdate);
    // ---------------- Users -----------------------------//
    app.get('/users/:_id', userController.get);
    app.put('/users/:_id', useSessionOrJwt, userController.update);
    app.get('/users/:_id/avatar', userController.getAvatar);
    app.post('/users/:_id/avatar', useSessionOrJwt, userController.createAvatarSignedUrl);
    // ------------------ Admin ---------------------//
    app.get('/admin', useSessionOrJwt, useAdminAccess, adminController.get);
    app.get('/admin/users', useSessionOrJwt, useAdminAccess, adminController.listUsers);
    app.get('/admin/animations', useSessionOrJwt, useAdminAccess, adminController.listAnimations);
    app.post('/admin/users/:_id/reverify', useSessionOrJwt, useAdminAccess, adminController.sendVerificationEmail);
    app.post('/admin/users/:_id/reset-pwd', useSessionOrJwt, useAdminAccess, adminController.sendResetEmail);
    app.post('/admin/users/:_id/inactivate', useSessionOrJwt, useAdminAccess, adminController.inactivateUser);
    app.post('/admin/users/:_id/activate', useSessionOrJwt, useAdminAccess, adminController.activateUser);
    // ---------------- Thumbnail -----------------------------//
    app.get('/animations/:animationId/thumbnail', /* extractUser, useAnimAccess, */ resourcesController.getThumbnail);
    app.post('/animations/:animationId/thumbnail', useSessionOrJwt, useAnimAccess, resourcesController.createThumbnailSignedUrl);
    // --------------- Restful Registration -------------------------//
    user_1.User.register(app, '/users');
    animation_1.Animation.register(app, '/animations');
    // ---------------- Content -----------------------------//
    app.post('/content/feedback', contentController.feedback);
    // --------------- Error handlers -------------------------//
    app.use(function (req, res, next) { return next(404); });
    app.use(handleErrors);
    winston.info('Routes [OK]');
}
exports.initialize = initialize;
//# sourceMappingURL=routes.js.map