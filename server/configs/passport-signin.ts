import * as passport from 'passport';
import { VerifyFunction, Strategy, IStrategyOptions } from 'passport-local';

import { IUser, User } from '../models/user';
import * as mailer from '../libs/mailer';

////////////////////////////////////////////////////////////////////////////////

class Options implements IStrategyOptions {
    usernameField: string = 'email';
    usernamePassword: string = 'password';
    passReqToCallback: boolean = true;
}

export class SigninStrategy extends Strategy {
    constructor() {
        super(new Options(), (req, username, password, done) => {
            User.findOne({email: username}, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err) return done(err);
                // if no user is found, return the message
                if (!user || !user.validPassword(password)) return done('Username or password does not match'); // req.flash is the way to set flashdata using connect-flash
                if (!user.active) {
                    if (user.activation.hash && user.validActivationTimestamp())
                        return done('Please verify your account first');
                    return done('Your account is not active');
                }
                // all is well, return successful user
                return done(null, user);
            });   
        });
    }
}