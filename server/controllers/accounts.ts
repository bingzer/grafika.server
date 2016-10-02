/* global Buffer */
import * as express from "express";
import * as passport from "passport";

import { IUser, User, userQuery, sanitize, generateJwtToken, generateDisqusToken, verifyJwtToken, checkAvailability } from '../models/user';
import * as mailer from '../libs/mailer';
import * as config from '../configs/config';
import * as utils from '../libs/utils';

let jwt            = require('jsonwebtoken');
let SECRET         = config.setting.$server.$superSecret;

////////////////////////////////////////////////////////////////////////////////////////////////

export function login(req: express.Request, res: express.Response, next: express.NextFunction){
    passport.authenticate('local-login', (err, user: IUser, info) => {
            if (err) return next(err);
            if (!user) return next(400);
            req.login(user, function (err){
                if (err) return next(err);
                return res.send({ token: generateJwtToken(user) }); 
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

export function logout(req : express.Request, res : express.Response) {
    req.logout();
    req.session.destroy(() => { 
        res.redirect('/');
    });
};

export function authenticate(req: express.Request | any, res: express.Response | any, next: express.NextFunction){
    tryAuthenticate(req, (err, user) => {
        if (err) return next(err);
        return res.send({token: generateJwtToken(user) });
    });
};
export function authenticateGoogle(req: express.Request, res: express.Response, next: express.NextFunction){
    passport.authenticate('google-android')(req, res, next);  
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
    let userInfo = req.body;

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
                    .then(() => res.sendStatus(200))
                    .catch((err) => {
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
    if (req.isAuthenticated()) res.status(200).send(generateDisqusToken(req.user));
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

function tryAuthenticate(req: express.Request|any, callback: (err, user?) => void) {
    if (req.isAuthenticated())
        return callback(undefined, req.user)
    else {
        let authHeader = req.header("Authorization");
        if (authHeader) {
            let token = authHeader.substring(authHeader.indexOf("Bearer ") + "Bearer ".length);
            if (token) {
                return verifyJwtToken(token, callback);
            }
        }
        return callback(401);
    }
}