import * as passport from 'passport';
import { VerifyFunction, OAuth2Strategy, IOAuth2StrategyOption } from 'passport-google-oauth'

import { IUser, User, randomUsername } from '../models/user';
import * as config from './config';

let GoogleTokenStrategy = require('passport-google-id-token');

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
                }
                // exists and update
                user.google.id             = profile.id;
                user.google.displayName    = profile.displayName;
                user.google.token          = accessToken;
                user.prefs.avatar          = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
                user.prefs.drawingAuthor   = user.username;
                // save the user
                user.save((err) => {
                    if (err) return done(err);
                    return done(null, user);
                });
            });
        });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class TokenIdOptions {
    clientID = config.setting.$auth.$googleId;
}

export class GoogleTokenIdOAuthStrategy implements passport.Strategy{
    constructor() {
        return new GoogleTokenStrategy(new TokenIdOptions(), (parsedToken, googleId, done) => {
            let payload = parsedToken.payload;
            let email = payload.email;

            User.findOne({ email: email }, (err, user) => {
                if (err) return done(err);

                if (!user) {
                    user = new User();
                    user.firstName    = payload.givenName;
                    user.lastName     = payload.familyName;
                    user.email        = email;
                    user.username     = randomUsername();
                    user.dateCreated  = Date.now();
                    user.dateModified = Date.now();
                    user.active       = true;
                    user.roles.push('user');
                }
                // exists and update
                user.google.displayName    = payload.name;
                user.prefs.avatar          = payload.picture;
                user.prefs.drawingAuthor   = user.username;

                user.save((err) => {
                    if (err) return done(err);
                    return done(null, user);
                });
            });
        });
    }
    
    authenticate(req: any, options?: Object): void {
        throw new Error('GoogleTokenIdOAuthStrategy.authenticate() not implemented');
    }
    
}