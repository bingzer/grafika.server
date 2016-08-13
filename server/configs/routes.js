"use strict";
var expressJwt = require('express-jwt');
var mongoose = require('mongoose');
var winston = require('winston');
var q = require('q');
var accountController = require('../controllers/accounts');
var resourcesController = require('../controllers/resources');
var userController = require('../controllers/users');
var syncController = require('../controllers/sync');
var adminController = require('../controllers/admin');
var animationController = require('../controllers/animation');
var config = require('../configs/config');
var animation_1 = require('../models/animation');
var user_1 = require('../models/user');
var SECRET = config.setting.$server.$superSecret;
function findToken(req) {
    if (req.headers['authorization'] && req.headers['authorization'].split(' ')[0] === 'Bearer')
        return req.headers['authorization'].split(' ')[1];
    else if (req.query && req.query.token)
        return req.query.token;
    return null;
}
function useSession(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else
        res.send(401);
}
;
function extractUser(req, res, next) {
    if (!req.isAuthenticated())
        expressJwt({ secret: SECRET, credentialsRequired: false, getToken: findToken })(req, res, next);
    else
        next();
}
function useJwt(req, res, next) {
    return expressJwt({ secret: SECRET, getToken: findToken })(req, res, next);
}
;
function useSessionOrJwt(req, res, next) {
    if (!req.isAuthenticated())
        return expressJwt({ secret: SECRET, getToken: findToken })(req, res, next);
    else
        next();
}
function useAnimAccess(req, res, next) {
    var animId = new mongoose.Types.ObjectId(req.params._id || req.params.animationId);
    var userId = (req.user && req.user._id) ? new mongoose.Types.ObjectId(req.user._id) : undefined;
    var queryAdmin = null;
    var query = null;
    var isAdmin = isAdministrator(req);
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
            if (req.method != 'GET') {
                if (!userId || result.userId.toString() !== userId.toString() && !isAdmin) {
                    return next(401);
                }
            }
            return next();
        }
        else
            return next(401);
    });
}
function useAdminAccess(req, res, next) {
    if (!isAdministrator(req))
        return next(401);
    return next();
}
function redirectHome(req, res, next) {
    res.redirect('/');
}
function isAdministrator(req) {
    return req.user && req.user.roles && req.user.roles.indexOf('administrator') > -1;
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
function generateAnimationId(req, res, next) {
    var objectId = new mongoose.Types.ObjectId();
    res.send(objectId.toHexString());
}
function initialize(app) {
    var defer = q.defer();
    setTimeout(function () {
        app.get('/api/accounts/google', accountController.googleLogin);
        app.get('/api/accounts/google/callback', accountController.googleCallback, accountController.providerLogin);
        app.get('/api/accounts/facebook', accountController.facebookLogin);
        app.get('/api/accounts/facebook/callback', accountController.facebookCallback, accountController.providerLogin);
        app.get('/api/accounts/disqus', useSessionOrJwt, accountController.disqusToken);
        app.post('/api/accounts', accountController.login);
        app.post('/api/accounts/logout', accountController.logout);
        app.post('/api/accounts/authenticate', accountController.authenticate);
        app.post('/api/accounts/authenticate/google', accountController.authenticateGoogle, accountController.authenticate);
        app.post('/api/accounts/register', accountController.register);
        app.post('/api/accounts/pwd/reset', accountController.resetPassword);
        app.post('/api/accounts/pwd', useSessionOrJwt, accountController.changePassword);
        app.post('/api/accounts/username-check', useSessionOrJwt, accountController.checkUsernameAvailability);
        app.get('/api/animations');
        app.post('/api/animations', useSessionOrJwt);
        app.get('/api/animations/object-id', generateAnimationId);
        app.get('/api/animations/:_id', extractUser, useAnimAccess);
        app.put('/api/animations/:_id', useSessionOrJwt, useAnimAccess);
        app.delete('/api/animations/:_id', useSessionOrJwt, useAnimAccess, animationController.remove);
        app.get('/api/animations/:_id/frames', extractUser, useAnimAccess);
        app.post('/api/animations/:_id/frames', useSessionOrJwt, useAnimAccess);
        app.post('/api/animations/sync', useSessionOrJwt, syncController.sync);
        app.post('/api/animations/sync/update', useSessionOrJwt, syncController.syncUpdate);
        app.get('/api/users/:_id', userController.get);
        app.put('/api/users/:_id', useSessionOrJwt, userController.update);
        app.get('/api/admin', useSessionOrJwt, useAdminAccess, adminController.get);
        app.get('/api/admin/users', useSessionOrJwt, useAdminAccess, adminController.listUsers);
        app.get('/api/admin/animations', useSessionOrJwt, useAdminAccess, adminController.listAnimations);
        app.post('/api/admin/users/:_id/reverify', useSessionOrJwt, useAdminAccess, adminController.sendVerificationEmail);
        app.post('/api/admin/users/:_id/reset-pwd', useSessionOrJwt, useAdminAccess, adminController.sendResetEmail);
        app.post('/api/admin/users/:_id/inactivate', useSessionOrJwt, useAdminAccess, adminController.inactivateUser);
        app.post('/api/admin/users/:_id/activate', useSessionOrJwt, useAdminAccess, adminController.activateUser);
        app.get('/api/animations/:animationId/thumbnail', resourcesController.getThumbnail);
        app.post('/api/animations/:animationId/thumbnail', useSessionOrJwt, useAnimAccess, resourcesController.createThumbnailSignedUrl);
        user_1.User.register(app, '/api/users');
        animation_1.Animation.register(app, '/api/animations');
        app.use(handleErrors);
        winston.info('Routes [OK]');
        defer.resolve();
    }, 100);
    return defer.promise;
}
exports.initialize = initialize;
//# sourceMappingURL=routes.js.map