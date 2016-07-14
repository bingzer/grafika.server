"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var passport_local_1 = require('passport-local');
var user_1 = require('../models/user');
var mailer = require('../libs/mailer');
var Options = (function () {
    function Options() {
        this.usernameField = 'username';
        this.usernamePassword = 'password';
        this.passReqToCallback = true;
    }
    return Options;
}());
var SignupStrategy = (function (_super) {
    __extends(SignupStrategy, _super);
    function SignupStrategy() {
        _super.call(this, new Options(), function (req, username, password, done) {
            user_1.User.findOne({ email: username }, function (err, user) {
                var userInfo = req.body;
                if (err)
                    return done(err);
                if (user) {
                    if (user.activation.hash || userInfo.hash) {
                        if (!userInfo.hash)
                            return done('User has not activated the account. Please check your email.');
                        if (!userInfo.hash || !user.validActivationHash(userInfo.hash))
                            return done("The link/action requested has been expired");
                        user.active = true;
                        user.local.password = user.generateHash(password);
                        user.activation.hash = null;
                        user.activation.timestamp = null;
                        user.save();
                        return done(null, user);
                    }
                    else
                        return done('Email is taken');
                }
                else {
                    var nameSplit = userInfo.name.split(' ');
                    userInfo.firstName = nameSplit[0];
                    if (nameSplit.length > 1)
                        userInfo.lastName = nameSplit[1];
                    userInfo.email = userInfo.email.toLowerCase();
                    var newUser = new user_1.User();
                    newUser.firstName = userInfo.firstName;
                    newUser.lastName = userInfo.lastName;
                    newUser.email = userInfo.email;
                    newUser.local.registered = true;
                    newUser.activation.hash = newUser.generateActivationHash();
                    newUser.activation.timestamp = new Date();
                    newUser.save(function (err) {
                        if (err)
                            return done(err);
                        if (newUser.validActivationTimestamp()) {
                            mailer.sendVerificationEmail(newUser)
                                .then(function () {
                                return done(null, newUser);
                            })
                                .catch(function (err) {
                                newUser.activation.hash = null;
                                newUser.activation.timestamp = null;
                                newUser.save();
                                return done("Unable to send verification email. Please try again");
                            });
                        }
                        else {
                            return done("A verification email has been sent");
                        }
                    });
                }
            });
        });
    }
    return SignupStrategy;
}(passport_local_1.Strategy));
exports.SignupStrategy = SignupStrategy;
//# sourceMappingURL=passport-signup.js.map