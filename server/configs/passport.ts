import * as passport from 'passport';
import * as winston from 'winston';
import * as q from 'q';

import { IUser, User } from '../models/user';
import { SignupStrategy } from './passport-signup';
import { SigninStrategy } from './passport-signin';
import { GoogleOAuthStrategy } from './passport-google';
import { FacebookOAuthStrategy } from './passport-facebook';

////////////////////////////////////////////////////////////////////////////////

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user.sanitize());
    });
});

export function initialize(app){
    let defer = q.defer();
    
    setTimeout(() => {
        // -- strategies
        passport.use('local-signup', new SignupStrategy());
        passport.use('local-login', new SigninStrategy());
        passport.use('google', new GoogleOAuthStrategy());
        passport.use('facebook', new FacebookOAuthStrategy());

        winston.info('Passport [OK]');
        defer.resolve();
    }, 100);

    return defer.promise;
}