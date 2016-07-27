"use strict";
var passport = require('passport');
var user_1 = require('../models/user');
var passport_signup_1 = require('./passport-signup');
var passport_signin_1 = require('./passport-signin');
var passport_google_1 = require('./passport-google');
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    user_1.User.findById(id, function (err, user) {
        done(err, user.sanitize());
    });
});
function initialize() {
    passport.use('local-signup', new passport_signup_1.SignupStrategy());
    passport.use('local-login', new passport_signin_1.SigninStrategy());
    passport.use('google', new passport_google_1.GoogleOAuthStrategy());
}
exports.initialize = initialize;
//# sourceMappingURL=passport.js.map