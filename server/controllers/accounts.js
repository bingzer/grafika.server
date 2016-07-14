"use strict";
var passport = require("passport");
var user_1 = require('../models/user');
var mailer = require('../libs/mailer');
var config = require('../configs/config');
var jwt = require('jsonwebtoken');
var SECRET = config.setting.$server.$superSecret;
function logout(req, res) {
    req.logout();
    req.session.destroy(function () {
        res.redirect('/');
    });
}
exports.logout = logout;
;
function login(req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
        if (err)
            return next(err);
        if (!user)
            return next(400);
        req.login(user, function (err) {
            if (err)
                return next(err);
            return res.send({ token: signToken(user) });
        });
    })(req, res, next);
}
exports.login = login;
;
function register(req, res, next) {
    passport.authenticate('local-signup', function (err, user, info) {
        if (err)
            return next(err);
        if (!user)
            return next(400);
        else
            res.sendStatus(200);
    })(req, res, next);
}
exports.register = register;
;
function authenticate(req, res, next) {
    if (req.isAuthenticated())
        res.send({ token: signToken(req.user) });
    else
        res.sendStatus(200);
}
exports.authenticate = authenticate;
;
function changePassword(req, res, next) {
    user_1.User.findById(req.user._id, function (err, user) {
        if (user.local.registered && !user.validPassword(req.body.currPwd))
            next('Incorrect password');
        else {
            user.local.registered = true;
            user.local.password = user.generateHash(req.body.newPwd);
            user.save();
            res.sendStatus(201);
        }
    });
}
exports.changePassword = changePassword;
;
function resetPassword(req, res, next) {
    var userInfo = req.body;
    user_1.User.findOne(user_1.userQuery(userInfo.email), function (err, user) {
        if (!err && user) {
            if (user.activation.hash && user.validActivationTimestamp()) {
                next('Reset email has already been sent. To resend please redo the step in 5 minutes');
            }
            else {
                user.activation.hash = user.generateActivationHash();
                user.activation.timestamp = new Date();
                user.save();
                mailer.sendResetEmail(user)
                    .then(function () { res.sendStatus(200); })
                    .catch(function (err) {
                    user.activation.hash = null;
                    user.activation.timestamp = null;
                    user.save();
                    next('Unable to send reset password email. Please try again');
                });
            }
        }
        else
            next('Email is not registered');
    });
}
exports.resetPassword = resetPassword;
;
function signToken(user) {
    if (!user)
        return null;
    return jwt.sign(user, SECRET, {
        expiresIn: '24hr'
    });
}
;
//# sourceMappingURL=accounts.js.map