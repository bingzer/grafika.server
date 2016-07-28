/* global Buffer */
import * as crypto from "crypto-js"
import * as express from "express";
import * as passport from "passport";

import { IUser, User, userQuery, sanitize, checkAvailability } from '../models/user';
import * as mailer from '../libs/mailer';
import * as config from '../configs/config';
var jwt            = require('jsonwebtoken');

let SECRET         = config.setting.$server.$superSecret;

////////////////////////////////////////////////////////////////////////////////////////////////

export function logout(req : express.Request, res : express.Response) {
    req.logout();
    req.session.destroy(() => { 
        res.redirect('/');
    });
};

export function login(req: express.Request, res: express.Response, next: express.NextFunction){
    passport.authenticate('local-login', (err, user, info) => {
            if (err) return next(err);
            if (!user) return next(400);
            req.login(user, function (err){
                if (err) return next(err);
                return res.send({token: signToken(user)}); 
            });
        })(req, res, next);
};

export function register(req: express.Request, res: express.Response, next: express.NextFunction){
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) return next(err);
        if (!user) return next(400);
        else res.sendStatus(200);
    })(req, res, next);  
};

export function authenticate(req: any, res: any, next: express.NextFunction){
    if (req.isAuthenticated()) {
        res.send({token: signToken(req.user)});
    }
    else res.sendStatus(200);
    // else {
    //     res.status(200).send({token: signToken( accountHelper.createPublicUser() )});
    // }
};

export function changePassword(req: any, res: any, next: express.NextFunction){
    User.findById(req.user._id, (err, user) => {
        if (user.local.registered && !user.validPassword(req.body.currPwd))
            next('Incorrect password');
        else {
            user.local.registered = true;
            user.local.password = user.generateHash(req.body.newPwd);
            user.save();
            res.sendStatus(201);
        }
    });
};

export function checkUsernameAvailability(req: any, res: any, next: express.NextFunction){
    checkAvailability(req.body)
        .then(() => res.sendStatus(200), () => next("Username is taken"));
}

export function resetPassword(req: express.Request, res: express.Response, next: express.NextFunction){
    var userInfo = req.body;

    User.findOne(userQuery(userInfo.email), (err, user) => {
        if (!err && user) {
            // check for timestamp see if it's still valid (less than 5 minutes)
            // before sending another email
            if (user.activation.hash && user.validActivationTimestamp()){
                next('Reset email has already been sent. To resend please redo the step in 5 minutes')
            }
            else {
                user.activation.hash      = user.generateActivationHash();
                user.activation.timestamp = new Date();
                user.save();
                mailer.sendResetEmail(user)
                    .then(function (){ res.sendStatus(200); })
                    .catch(function (err){
                        user.activation.hash      = null;
                        user.activation.timestamp = null;
                        user.save();
                        next('Unable to send reset password email. Please try again');
                    });        
            }
        }
        else next('Email is not registered');
    });
};

export function disqusToken(req: express.Request | any, res: express.Response, next: express.NextFunction){
    if (req.isAuthenticated()) res.status(200).send(disqusSignon(req.user));
    else next(401);
}

export function googleLogin(req: express.Request, res: express.Response, next: express.NextFunction){
    passport.authenticate('google', { scope: config.setting.$auth.$googleScopes } )(req, res, next);  
};
export function googleCallback(req: express.Request, res: express.Response, next: express.NextFunction){
    passport.authenticate('google')(req, res, next);
};

export function facebookLogin(req: express.Request, res: express.Response, next: express.NextFunction){
    passport.authenticate('facebook', { scope: config.setting.$auth.$facebookScopes } )(req, res, next);  
};
export function facebookCallback(req: express.Request, res: express.Response, next: express.NextFunction){
    passport.authenticate('facebook')(req, res, next);
};

export function providerLogin(req: express.Request | any, res: express.Response, next: express.NextFunction) {
    if (req.isAuthenticated) {
        req.login(req.user, (err) => {
            if (err) return next(err);
            res.redirect('/?action=authenticate');
        });
    }
    else next(401);
}

////////////////////////////////////////////////////////////////////////////////////////////////
    
/** Sign token with user credentials in it */
function signToken(user: any | IUser){
    if (!user) return null;

    return jwt.sign(sanitize(user), SECRET, {
        expiresIn: '24hr' // expires in 24 hours
    });
};

function disqusSignon(user) {
    var disqusData = {
      id: user.email,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };

    var disqusStr = JSON.stringify(disqusData);
    var timestamp = Math.round(+new Date() / 1000);

    /*
     * Note that `Buffer` is part of node.js
     * For pure Javascript or client-side methods of
     * converting to base64, refer to this link:
     * http://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript
     */
    var message = new Buffer(disqusStr).toString('base64');

    /* 
     * CryptoJS is required for hashing (included in dir)
     * https://code.google.com/p/crypto-js/
     */
    var result = crypto.HmacSHA1(message + " " + timestamp, config.setting.$auth.$disqusSecret);
    var hexsig = crypto.enc.Hex.stringify(result);

    return {
      public: config.setting.$auth.$disqusId,
      token: message + " " + hexsig + " " + timestamp
    };
}