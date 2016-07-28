"use strict";
var passport = require('passport');
var winston = require('winston');
var q = require('q');
var user_1 = require('../models/user');
var passport_signup_1 = require('./passport-signup');
var passport_signin_1 = require('./passport-signin');
var passport_google_1 = require('./passport-google');
var passport_facebook_1 = require('./passport-facebook');
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    user_1.User.findById(id, function (err, user) {
        done(err, user.sanitize());
    });
});
function initialize(app) {
    var defer = q.defer();
    setTimeout(function () {
        passport.use('local-signup', new passport_signup_1.SignupStrategy());
        passport.use('local-login', new passport_signin_1.SigninStrategy());
        passport.use('google', new passport_google_1.GoogleOAuthStrategy());
        passport.use('facebook', new passport_facebook_1.FacebookOAuthStrategy());
        winston.info('Passport [OK]');
        defer.resolve();
    }, 100);
    return defer.promise;
}
exports.initialize = initialize;
//# sourceMappingURL=passport.js.map