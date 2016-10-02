"use strict";
var crypto = require("crypto-js");
var passport = require("passport");
var user_1 = require('../models/user');
var mailer = require('../libs/mailer');
var config = require('../configs/config');
var jwt = require('jsonwebtoken');
var SECRET = config.setting.$server.$superSecret;
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
    req.session.destroy(function () {
        res.redirect('/');
    });
}
exports.logout = logout;
;
function authenticate(req, res, next) {
    tryAuthenticate(req, function (err, user) {
        if (err)
            return next(err);
        return res.send({ token: user_1.generateJwtToken(user) });
    });
}
exports.authenticate = authenticate;
;
function authenticateGoogle(req, res, next) {
    passport.authenticate('google-android')(req, res, next);
}
exports.authenticateGoogle = authenticateGoogle;
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
function checkUsernameAvailability(req, res, next) {
    user_1.checkAvailability(req.body)
        .then(function () { return res.sendStatus(200); }, function () { return next("Username is taken"); });
}
exports.checkUsernameAvailability = checkUsernameAvailability;
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
        res.status(200).send(disqusSignon(req.user));
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
            res.redirect('/?action=authenticate');
        });
    }
    else
        next(401);
}
exports.providerLogin = providerLogin;
function disqusSignon(user) {
    var disqusData = {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.prefs.avatar,
        url: 'http://grafika.bingzer.com/users/' + user._id
    };
    var disqusStr = JSON.stringify(disqusData);
    var timestamp = Math.round(+new Date() / 1000);
    var message = new Buffer(disqusStr).toString('base64');
    var result = crypto.HmacSHA1(message + " " + timestamp, config.setting.$auth.$disqusSecret);
    var hexsig = crypto.enc.Hex.stringify(result);
    return {
        public: config.setting.$auth.$disqusId,
        token: message + " " + hexsig + " " + timestamp
    };
}
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