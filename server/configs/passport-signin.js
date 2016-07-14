"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var passport_local_1 = require('passport-local');
var user_1 = require('../models/user');
var Options = (function () {
    function Options() {
        this.usernameField = 'username';
        this.usernamePassword = 'password';
        this.passReqToCallback = true;
    }
    return Options;
}());
var SigninStrategy = (function (_super) {
    __extends(SigninStrategy, _super);
    function SigninStrategy() {
        _super.call(this, new Options(), function (req, username, password, done) {
            user_1.User.findOne({ email: username }, function (err, user) {
                if (err)
                    return done(err);
                if (!user || !user.validPassword(password))
                    return done('Username or password does not match');
                if (!user.active) {
                    if (user.activation.hash && user.validActivationTimestamp())
                        return done('Please verify your account first');
                    return done('Your account is not active');
                }
                return done(null, user);
            });
        });
    }
    return SigninStrategy;
}(passport_local_1.Strategy));
exports.SigninStrategy = SigninStrategy;
//# sourceMappingURL=passport-signin.js.map