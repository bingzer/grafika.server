"use strict";
var passport = require("passport");
var user_1 = require("../models/user");
var mailer = require("../libs/mailer");
var config = require("../configs/config");
var jwt = require('jsonwebtoken');
var SECRET = config.setting.$server.$superSecret;
////////////////////////////////////////////////////////////////////////////////////////////////
function login(req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
        if (err)
            return next(err);
        if (!user)
            return next(400);
        req.login(user, function (err) {
            if (err)
                return next(err);
            return res.send({ token: user_1.generateJwtToken(user) });
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
function logout(req, res) {
    req.logout();
    res.send(200);
}
exports.logout = logout;
;
function authenticate(req, res, next) {
    tryAuthenticate(req, function (err, user) {
        function sendUserJwtToken() {
            user_1.updateLastSeen(user);
            res.send({ token: user_1.generateJwtToken(user) });
        }
        if (err)
            return next(err);
        if (req.query.refreshToken) {
            return user_1.User.findById(user._id, function (err, user) {
                if (err)
                    return next(err);
                if (!user)
                    return next(404);
                sendUserJwtToken();
            });
        }
        return sendUserJwtToken();
    });
}
exports.authenticate = authenticate;
;
function authenticateGoogle(req, res, next) {
    passport.authenticate('google-android')(req, res, next);
}
exports.authenticateGoogle = authenticateGoogle;
;
function authenticateFacebook(req, res, next) {
    passport.authenticate('facebook-android')(req, res, next);
}
exports.authenticateFacebook = authenticateFacebook;
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
function checkUsernameAvailability(req, res, next) {
    user_1.checkAvailability(req.body)
        .then(function () { return res.sendStatus(200); }, function () { return next("Username is taken"); });
}
exports.checkUsernameAvailability = checkUsernameAvailability;
function resetPassword(req, res, next) {
    var userInfo = req.body;
    user_1.User.findOne(user_1.userQuery(userInfo.email), function (err, user) {
        if (!err && user) {
            // check for timestamp see if it's still valid (less than 5 minutes)
            // before sending another email
            if (user.activation.hash && user.validActivationTimestamp()) {
                next('Reset email has already been sent. To resend please redo the step in 5 minutes');
            }
            else {
                user.activation.hash = user.generateActivationHash();
                user.activation.timestamp = new Date();
                user.save();
                mailer.sendResetEmail(user)
                    .then(function () { return res.sendStatus(200); })
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
function disqusToken(req, res, next) {
    if (req.isAuthenticated())
        res.status(200).send(user_1.generateDisqusToken(req.user));
    else
        next(401);
}
exports.disqusToken = disqusToken;
function googleLogin(req, res, next) {
    passport.authenticate('google', { scope: config.setting.$auth.$googleScopes })(req, res, next);
}
exports.googleLogin = googleLogin;
;
function googleCallback(req, res, next) {
    passport.authenticate('google')(req, res, next);
}
exports.googleCallback = googleCallback;
;
function facebookLogin(req, res, next) {
    passport.authenticate('facebook', { scope: config.setting.$auth.$facebookScopes })(req, res, next);
}
exports.facebookLogin = facebookLogin;
;
function facebookCallback(req, res, next) {
    passport.authenticate('facebook')(req, res, next);
}
exports.facebookCallback = facebookCallback;
;
function providerLogin(req, res, next) {
    if (req.isAuthenticated) {
        req.login(req.user, function (err) {
            if (err)
                return next(err);
            var token = user_1.generateJwtToken(req.user);
            res.redirect(config.setting.$content.$url + '?action=authenticate&token=' + token);
        });
    }
    else
        next(401);
}
exports.providerLogin = providerLogin;
////////////////////////////////////////////////////////////////////////////////////////////////
function tryAuthenticate(req, callback) {
    if (req.isAuthenticated())
        return callback(undefined, req.user);
    else {
        var authHeader = req.header("Authorization");
        if (authHeader) {
            var token = authHeader.substring(authHeader.indexOf("Bearer ") + "Bearer ".length);
            if (token) {
                return user_1.verifyJwtToken(token, callback);
            }
        }
        return callback(401);
    }
}
//# sourceMappingURL=accounts.js.map