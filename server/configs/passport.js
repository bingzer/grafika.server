"use strict";
var passport = require("passport");
var winston = require("winston");
var user_1 = require("../models/user");
var passport_signup_1 = require("./passport-signup");
var passport_signin_1 = require("./passport-signin");
var passport_google_1 = require("./passport-google");
var passport_facebook_1 = require("./passport-facebook");
var GoogleTokenStrategy = require('passport-google-id-token');
////////////////////////////////////////////////////////////////////////////////
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    user_1.User.findById(id, function (err, user) {
        done(err, user.sanitize());
    });
});
function initialize(app) {
    // -- strategies
    passport.use('local-signup', new passport_signup_1.SignupStrategy());
    passport.use('local-login', new passport_signin_1.SigninStrategy());
    passport.use('google', new passport_google_1.GoogleOAuthStrategy());
    passport.use('facebook', new passport_facebook_1.FacebookOAuthStrategy());
    passport.use('google-android', new passport_google_1.GoogleTokenIdOAuthStrategy());
    passport.use('facebook-android', new passport_facebook_1.FacebookTokenIdOAuthStrategy());
    winston.info('Passport [OK]');
}
exports.initialize = initialize;
//# sourceMappingURL=passport.js.map