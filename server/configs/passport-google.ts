import * as passport from 'passport';
import { VerifyFunction, OAuth2Strategy, IOAuth2StrategyOption } from 'passport-google-oauth'

import { IUser, User, randomUsername } from '../models/user';
import * as config from './config';

class Options implements IOAuth2StrategyOption {
    clientID: string = config.setting.$auth.$googleId;
    clientSecret: string = config.setting.$auth.$googleSecret;
    callbackURL: string = config.setting.$auth.$googleCallbackUrl;
}

export class GoogleOAuthStrategy extends OAuth2Strategy {
    constructor() {
        super(new Options(), (accessToken, refreshToken, profile, done) => {
            User.findOne({ email: profile.emails[0].value }, (err, user) => {
                if (err) return done(err, null);
                // does not exists
                if (!user) {
                    user = new User();
                    user.firstName    = profile.name.givenName;
                    user.lastName     = profile.name.familyName;
                    user.email        = profile.emails[0].value;
                    user.username     = randomUsername();
                    user.dateCreated  = Date.now();
                    user.dateModified = Date.now();
                    user.active       = true;
                    user.roles.push('user');
                    
                    user.prefs.avatar = profile.photos.length > 0 ? profile.photos[0].value : null;
                    user.prefs.drawingAuthor = user.username;
                }
                // exists and update
                user.google.id           = profile.id;
                user.google.displayName  = profile.displayName;
                user.google.token        = accessToken;
                // save the user
                user.save((err) => {
                    if (err) done(err);
                    return done(null, user);
                });
            });
        });
    }
}
