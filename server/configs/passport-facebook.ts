import * as passport from 'passport';
import { Strategy, IStrategyOption } from 'passport-facebook'

import { IUser, User, randomUsername } from '../models/user';
import * as config from './config';

let FacebookTokenStrategy = require('passport-facebook-token');

class Options implements IStrategyOption {
    clientID: string = config.setting.$auth.$facebookId;
    clientSecret: string = config.setting.$auth.$facebookSecret;
    callbackURL: string = config.setting.$auth.$facebookCallbackUrl;
    enableProof: boolean = true;
    profileFields: string[] = ['id', 'emails', 'name', 'photos'] 
}

export class FacebookOAuthStrategy extends Strategy {
    constructor() {
        super(new Options(), (accessToken, refreshToken, profile, done) => {
            User.findOne({ email: profile.emails[0].value }, (err, user) => {
                if (err) return done(err, null);
                // does not exists
                if (!user) {
                    user = createNewUser(profile);
                }
                // exists and update
                user.facebook.id           = profile.id;
                user.facebook.displayName  = profile.displayName;
                user.facebook.token        = accessToken;
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
    clientID = config.setting.$auth.$facebookId;
    clientSecret = config.setting.$auth.$facebookSecret;
}

export class FacebookTokenIdOAuthStrategy implements passport.Strategy{
    constructor() {
        return new FacebookTokenStrategy(new TokenIdOptions(), (parsedToken, refreshToken, profile, done) => {
            let email = (profile && profile.emails && profile.emails.length > 0) ? profile.emails[0].value : '';
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
        throw new Error('FacebookTokenIdOAuthStrategy.authenticate() not implemented');
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