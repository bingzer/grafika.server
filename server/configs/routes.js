"use strict";
var expressJwt = require('express-jwt');
var mongoose = require('mongoose');
var winston = require('winston');
var accountController = require('../controllers/accounts');
var resourcesController = require('../controllers/resources');
var userController = require('../controllers/users');
var syncController = require('../controllers/sync');
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
        var status = 500;
        var msg = undefined;
        var stack = err.stack;
        delete err.stack;
        if (typeof err == 'number')
            status = err;
        else if (typeof err == 'string') {
            status = 400;
            msg = err;
        }
        else if (err.status) {
            status = err.status;
            msg = err.msg || err.message;
        }
        else {
            msg = 'This is our fault, will be checking on this';
        }
        res.status(status).send(msg);
        winston.error('HTTP Error. Status Code=' + status + (msg ? '  msg=' + msg : ''), stack);
    }
    else
        next();
}
function initialize(app) {
    app.post('/api/accounts', accountController.login);
    app.post('/api/accounts/logout', accountController.logout);
    app.post('/api/accounts/authenticate', accountController.authenticate);
    app.post('/api/accounts/register', accountController.register);
    app.post('/api/accounts/pwd/reset', accountController.resetPassword);
    app.post('/api/accounts/pwd', useSessionOrJwt, accountController.changePassword);
    app.post('/api/accounts/username-check', useSessionOrJwt, accountController.checkUsernameAvailability);
    app.get('/api/animations');
    app.post('/api/animations', useSessionOrJwt);
    app.get('/api/animations/:_id', extractUser, useAnimAccess);
    app.put('/api/animations/:_id', useSessionOrJwt, useAnimAccess);
    app.delete('/api/animations/', useSessionOrJwt, useAnimAccess);
    app.get('/api/animations/:_id/frames', extractUser, useAnimAccess);
    app.post('/api/animations/:_id/frames', useSessionOrJwt, useAnimAccess);
    app.post('/api/animations/sync', useSessionOrJwt, syncController.sync);
    app.get('/api/users/:_id', useSessionOrJwt, userController.get);
    app.put('/api/users/:_id', useSessionOrJwt, userController.update);
    app.get('/api/animations/:animationId/thumbnail', resourcesController.getThumbnail);
    app.post('/api/animations/:animationId/thumbnail', useSessionOrJwt, useAnimAccess, resourcesController.createThumbnailSignedUrl);
    user_1.User.register(app, '/api/users');
    animation_1.Animation.register(app, '/api/animations');
    app.use(handleErrors);
    winston.info('Routes [OK]');
}
exports.initialize = initialize;
//# sourceMappingURL=routes.js.map