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

export class SignupStrategy extends Strategy {
    constructor() {
        super(new Options(), (req, username, password, done) => {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ email: username }, (err, user) => {
                var userInfo = req.body;
                // if there are any errors, return the error
                if (err) return done(err);
                // check to see if theres already a user with that email
                if (user) {
                    // If there's an active hash
                    if (user.activation.hash || userInfo.hash){
                        // if request didn't provide any hash
                        if (!userInfo.hash) return done('User has not activated the account. Please check your email.');
                        // check the hash really quick
                        if (!userInfo.hash || !user.validActivationHash(userInfo.hash)) 
                            return done("The link/action requested has been expired");
                        // user is trying to activate their account
                        user.active = true;
                        user.local.password = user.generateHash(password);
                        user.activation.hash = null;
                        user.activation.timestamp = null;
                        user.save();
                        return done(null, user);
                    }
                    else return done('Email is taken');
                }
                else {
                    var nameSplit = userInfo.name.split(' ');
                    userInfo.firstName = nameSplit[0];
                    if (nameSplit.length > 1)
                        userInfo.lastName = nameSplit[1];
                    userInfo.email = userInfo.email.toLowerCase();  // lower case    
                        
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();
                    // set the user's local credentials
                    newUser.firstName            = userInfo.firstName;
                    newUser.lastName             = userInfo.lastName;
                    newUser.email                = userInfo.email;
                    newUser.local.registered     = true;
                    newUser.activation.hash      = newUser.generateActivationHash();
                    newUser.activation.timestamp = new Date();
                    // save the user
                    newUser.save(function(err) {
                        if (err) return done(err);
                        if (newUser.validActivationTimestamp()){
                            mailer.sendVerificationEmail(newUser)
                                .then(function (){
                                    return done(null, newUser)
                                })
                                .catch(function (err){
                                    newUser.activation.hash      = null;
                                    newUser.activation.timestamp = null;
                                    newUser.save();
                                    return done("Unable to send verification email. Please try again");   
                                });
                        }
                        else {
                            return done("A verification email has been sent");    
                        }
                    });
                }
            });
        });
    }
}