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
                if (!user) {
                    user = createNewUser(profile);
                }
                user.google.id = profile.id;
                user.google.displayName = profile.displayName;
                user.google.token = accessToken;
                user.prefs.avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
                user.prefs.drawingAuthor = user.username;
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
var TokenIdOptions = (function () {
    function TokenIdOptions() {
        this.clientID = config.setting.$auth.$googleId;
    }
    return TokenIdOptions;
}());
var GoogleTokenIdOAuthStrategy = (function () {
    function GoogleTokenIdOAuthStrategy() {
        return new GoogleTokenStrategy(new TokenIdOptions(), function (parsedToken, googleId, done) {
            var email = parsedToken.payload.email;
            var profile = parsedToken.payload;
            user_1.User.findOne({ email: email }, function (err, user) {
                if (!user) {
                    user = createNewUser(profile);
                    user.save(function (err) {
                        if (err)
                            done(err);
                        return done(null, user);
                    });
                }
                else
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
function createNewUser(profile) {
    var user = new user_1.User();
    user.firstName = (profile && profile.name ? profile.name.givenName : "");
    user.lastName = (profile && profile.name ? profile.name.familyName : "");
    user.email = profile.emails[0].value;
    user.username = user_1.randomUsername();
    user.dateCreated = Date.now();
    user.dateModified = Date.now();
    user.active = true;
    user.roles.push('user');
    return user;
}
//# sourceMappingURL=passport-google.js.map