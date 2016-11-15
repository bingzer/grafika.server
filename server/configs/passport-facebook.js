"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var passport_facebook_1 = require("passport-facebook");
var user_1 = require("../models/user");
var config = require("./config");
var FacebookTokenStrategy = require('passport-facebook-token');
var Options = (function () {
    function Options() {
        this.clientID = config.setting.$auth.$facebookId;
        this.clientSecret = config.setting.$auth.$facebookSecret;
        this.callbackURL = config.setting.$auth.$facebookCallbackUrl;
        this.enableProof = true;
        this.profileFields = ['id', 'emails', 'name', 'photos'];
    }
    return Options;
}());
var FacebookOAuthStrategy = (function (_super) {
    __extends(FacebookOAuthStrategy, _super);
    function FacebookOAuthStrategy() {
        return _super.call(this, new Options(), function (accessToken, refreshToken, profile, done) {
            user_1.User.findOne({ email: profile.emails[0].value }, function (err, user) {
                if (err)
                    return done(err, null);
                // does not exists
                if (!user) {
                    user = new user_1.User();
                    user.firstName = profile.name.givenName;
                    user.lastName = profile.name.familyName;
                    user.email = profile.emails[0].value;
                    user.username = user_1.randomUsername();
                    user.dateCreated = Date.now();
                    user.dateModified = Date.now();
                    user.prefs.avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
                }
                // exists and update
                user.facebook.id = profile.id;
                user.facebook.displayName = profile.displayName;
                user.facebook.token = accessToken;
                user.prefs.drawingAuthor = user.username;
                user.active = true;
                // save the user
                user.save(function (err) {
                    if (err)
                        done(err);
                    return done(null, user);
                });
            });
        }) || this;
    }
    return FacebookOAuthStrategy;
}(passport_facebook_1.Strategy));
exports.FacebookOAuthStrategy = FacebookOAuthStrategy;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var TokenIdOptions = (function () {
    function TokenIdOptions() {
        this.clientID = config.setting.$auth.$facebookId;
        this.clientSecret = config.setting.$auth.$facebookSecret;
    }
    return TokenIdOptions;
}());
var FacebookTokenIdOAuthStrategy = (function () {
    function FacebookTokenIdOAuthStrategy() {
        return new FacebookTokenStrategy(new TokenIdOptions(), function (parsedToken, refreshToken, profile, done) {
            var email = (profile && profile.emails && profile.emails.length > 0) ? profile.emails[0].value : '';
            user_1.User.findOne({ email: email }, function (err, user) {
                if (err)
                    return done(err, null);
                // does not exists
                if (!user) {
                    user = new user_1.User();
                    user.firstName = profile.name.givenName;
                    user.lastName = profile.name.familyName;
                    user.email = profile.emails[0].value;
                    user.username = user_1.randomUsername();
                    user.dateCreated = Date.now();
                    user.dateModified = Date.now();
                    user.active = true;
                    user.prefs.avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
                }
                // exists and update
                user.facebook.id = profile.id;
                user.facebook.displayName = profile.displayName;
                user.facebook.token = parsedToken;
                user.prefs.drawingAuthor = user.username;
                user.active = true;
                // save the user
                user.save(function (err) {
                    if (err)
                        done(err);
                    return done(null, user);
                });
            });
        });
    }
    FacebookTokenIdOAuthStrategy.prototype.authenticate = function (req, options) {
        throw new Error('FacebookTokenIdOAuthStrategy.authenticate() not implemented');
    };
    return FacebookTokenIdOAuthStrategy;
}());
exports.FacebookTokenIdOAuthStrategy = FacebookTokenIdOAuthStrategy;
//# sourceMappingURL=passport-facebook.js.map