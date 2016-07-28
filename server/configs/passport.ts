import * as passport from 'passport';

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

export function initialize(){
    // -- strategies
    passport.use('local-signup', new SignupStrategy());
    passport.use('local-login', new SigninStrategy());
    passport.use('google', new GoogleOAuthStrategy());
    passport.use('facebook', new FacebookOAuthStrategy());
}