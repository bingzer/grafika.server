"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var passport_google_oauth_1 = require('passport-google-oauth');
var user_1 = require('../models/user');
var config = require('./config');
var GoogleTokenStrategy = require('passport-google-id-token');
var Options = (function () {
    function Options() {
        this.clientID = config.setting.$auth.$googleId;
        this.clientSecret = config.setting.$auth.$googleSecret;
        this.callbackURL = config.setting.$auth.$googleCallbackUrl;
    }
    return Options;
}());
var GoogleOAuthStrategy = (function (_super) {
    __extends(GoogleOAuthStrategy, _super);
    function GoogleOAuthStrategy() {
        _super.call(this, new Options(), function (accessToken, refreshToken, profile, done) {
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
                    user.active = true;
                    user.roles.push('user');
                }
                // exists and update
                user.google.id = profile.id;
                user.google.displayName = profile.displayName;
                user.google.token = accessToken;
                user.prefs.avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
                user.prefs.drawingAuthor = user.username;
                // save the user
                user.save(function (err) {
                    if (err)
                        done(err);
                    return done(null, user);
                });
            });
        });
    }
    return GoogleOAuthStrategy;
}(passport_google_oauth_1.OAuth2Strategy));
exports.GoogleOAuthStrategy = GoogleOAuthStrategy;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var TokenIdOptions = (function () {
    function TokenIdOptions() {
        this.clientID = config.setting.$auth.$googleId;
    }
    return TokenIdOptions;
}());
var GoogleTokenIdOAuthStrategy = (function () {
    function GoogleTokenIdOAuthStrategy() {
        return new GoogleTokenStrategy(new TokenIdOptions(), function (parsedToken, googleId, done) {
            var payload = parsedToken.payload;
            var email = payload.email;
            user_1.User.findOne({ email: email }, function (err, user) {
                if (err)
                    return done(err);
                if (!user) {
                    user = new user_1.User();
                    user.firstName = payload.givenName;
                    user.lastName = payload.familyName;
                    user.email = email;
                    user.username = user_1.randomUsername();
                    user.dateCreated = Date.now();
                    user.dateModified = Date.now();
                    user.active = true;
                    user.roles.push('user');
                }
                // exists and update
                user.google.displayName = payload.name;
                user.prefs.avatar = payload.picture;
                user.prefs.drawingAuthor = user.username;
                done(null, user);
            });
        });
    }
    GoogleTokenIdOAuthStrategy.prototype.authenticate = function (req, options) {
        throw new Error('GoogleTokenIdOAuthStrategy.authenticate() not implemented');
    };
    return GoogleTokenIdOAuthStrategy;
}());
exports.GoogleTokenIdOAuthStrategy = GoogleTokenIdOAuthStrategy;
//# sourceMappingURL=passport-google.js.map