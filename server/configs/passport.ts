import * as passport from 'passport';
import * as winston from 'winston';
import * as q from 'q';

import { IUser, User } from '../models/user';
import { SignupStrategy } from './passport-signup';
import { SigninStrategy } from './passport-signin';
import { GoogleOAuthStrategy, GoogleTokenIdOAuthStrategy } from './passport-google';
import { FacebookOAuthStrategy, FacebookTokenIdOAuthStrategy } from './passport-facebook';

let GoogleTokenStrategy = require('passport-google-id-token');

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
    // -- strategies
    passport.use('local-signup', new SignupStrategy());
    passport.use('local-login', new SigninStrategy());
    passport.use('google', new GoogleOAuthStrategy());
    passport.use('facebook', new FacebookOAuthStrategy());
    passport.use('google-android', new GoogleTokenIdOAuthStrategy());
    passport.use('facebook-android', new FacebookTokenIdOAuthStrategy());

    winston.info('Passport [OK]');
}