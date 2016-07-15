"use strict";
var passport = require('passport');
var user_1 = require('../models/user');
var passport_signup_1 = require('./passport-signup');
var passport_signin_1 = require('./passport-signin');
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    var exclude = { 'local.password': 0, 'activation': 0 };
    user_1.User.findById(id, exclude, function (err, user) {
        done(err, user);
    });
});
function initialize() {
    passport.use('local-signup', new passport_signup_1.SignupStrategy());
    passport.use('local-login', new passport_signin_1.SigninStrategy());
}
exports.initialize = initialize;
//# sourceMappingURL=passport.js.map