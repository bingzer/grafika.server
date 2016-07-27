"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var passport_google_oauth_1 = require('passport-google-oauth');
var user_1 = require('../models/user');
var config = require('./config');
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
                    user = new user_1.User();
                    user.firstName = profile.name.givenName;
                    user.lastName = profile.name.familyName;
                    user.email = profile.emails[0].value;
                    user.username = user_1.randomUsername();
                    user.dateCreated = Date.now();
                    user.dateModified = Date.now();
                    user.active = true;
                    user.roles.push('user');
                    user.prefs.avatar = profile.photos.length > 0 ? profile.photos[0].value : null;
                    user.prefs.drawingAuthor = user.username;
                }
                user.google.id = profile.id;
                user.google.displayName = profile.displayName;
                user.google.token = accessToken;
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
//# sourceMappingURL=passport-google.js.map