"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var passport_local_1 = require("passport-local");
var user_1 = require("../models/user");
var mailer = require("../libs/mailer");
////////////////////////////////////////////////////////////////////////////////
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
        return _super.call(this, new Options(), function (req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            user_1.User.findOne({ email: username }, function (err, user) {
                var userInfo = req.body;
                // if there are any errors, return the error
                if (err)
                    return done(err);
                // check to see if theres already a user with that email
                if (user) {
                    // If there's an active hash
                    if (user.activation.hash || userInfo.hash) {
                        // if request didn't provide any hash
                        if (!userInfo.hash)
                            return done('User has not activated the account. Please check your email.');
                        // check the hash really quick
                        if (!userInfo.hash || !user.validActivationHash(userInfo.hash))
                            return done("The link/action requested has been expired");
                        // user is trying to activate their account
                        user.active = true;
                        user.local.password = user.generateHash(password);
                        user.activation.hash = null;
                        user.activation.timestamp = null;
                        user.dateModified = Date.now();
                        user.save();
                        return done(null, user);
                    }
                    else
                        return done('Email is taken');
                }
                else {
                    // creating the user for the first time
                    if (!userInfo.name) {
                        return done("Name is required");
                    }
                    var nameSplit = userInfo.name.split(' ');
                    userInfo.firstName = nameSplit[0];
                    if (nameSplit.length > 1)
                        userInfo.lastName = nameSplit[1];
                    userInfo.email = userInfo.username.toLowerCase(); // lower case    
                    // if there is no user with that email
                    // create the user
                    var newUser_1 = new user_1.User();
                    // set the user's local credentials
                    newUser_1.firstName = userInfo.firstName;
                    newUser_1.lastName = userInfo.lastName;
                    newUser_1.email = userInfo.email;
                    newUser_1.username = user_1.randomUsername();
                    newUser_1.dateCreated = Date.now();
                    newUser_1.dateModified = Date.now();
                    newUser_1.prefs.drawingAuthor = newUser_1.username;
                    newUser_1.local.registered = true;
                    newUser_1.activation.hash = newUser_1.generateActivationHash();
                    newUser_1.activation.timestamp = new Date();
                    // save the user
                    newUser_1.save(function (err) {
                        if (err)
                            return done(err);
                        if (newUser_1.validActivationTimestamp()) {
                            mailer.sendVerificationEmail(newUser_1)
                                .then(function () {
                                return done(null, newUser_1);
                            })
                                .catch(function (err) {
                                newUser_1.activation.hash = null;
                                newUser_1.activation.timestamp = null;
                                newUser_1.save();
                                return done("Unable to send verification email. Please try again");
                            });
                        }
                        else {
                            return done("A verification email has been sent");
                        }
                    });
                }
            });
        }) || this;
    }
    return SignupStrategy;
}(passport_local_1.Strategy));
exports.SignupStrategy = SignupStrategy;
//# sourceMappingURL=passport-signup.js.map