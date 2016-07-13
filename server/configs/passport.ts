import * as passport from 'passport';

import { IUser, User } from '../models/user';
import { SignupStrategy } from './passport-signup';
import { SigninStrategy } from './passport-signin';

////////////////////////////////////////////////////////////////////////////////

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    var exclude = { 'local.password': 0, 'activation': 0};
    User.findById(id, exclude, (err, user) => {
        done(err, user);
    });
});

export function initialize(){
    // -- strategies
    passport.use('local-signup', new SignupStrategy());
    passport.use('local-login', new SigninStrategy());
}