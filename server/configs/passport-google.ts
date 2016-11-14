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
                    user = createNewUser(profile);
                }
                // exists and update
                user.google.id             = profile.id;
                user.google.displayName    = profile.displayName;
                user.google.token          = accessToken;
                user.prefs.avatar          = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
                user.prefs.drawingAuthor   = user.username;
                // save the user
                user.save((err) => {
                    if (err) done(err);
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
            let email = parsedToken.payload.email;
            let profile = parsedToken.payload;
            User.findOne({ email: email }, (err, user) => {
                if (!user){
                    user = createNewUser(profile);
                    user.save((err) => {
                        if (err) done(err);
                        return done(null, user);
                    })
                }
                else done(null, user);
            });
        });
    }
    
    authenticate(req: any, options?: Object): void {
        throw new Error('GoogleTokenIdOAuthStrategy.authenticate() not implemented');
    }
    
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createNewUser(profile): IUser {
    let user = new User();
    user.firstName    = (profile && profile.name ? profile.name.givenName : "");
    user.lastName     = (profile && profile.name ? profile.name.familyName : "");
    user.email        = profile.emails[0].value;
    user.username     = randomUsername();
    user.dateCreated  = Date.now();
    user.dateModified = Date.now();
    user.active       = true;
    user.roles.push('user');

    return user;
}