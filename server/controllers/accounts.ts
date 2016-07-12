/* global Buffer */
import * as crypto from "crypto"
import * as express from "express";
import * as passport from "passport";

import { IUser, User, userQuery } from '../models/user';
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
                return res.status(200).send({token: signToken(user)}); 
            });
        })(req, res, next);
};

export function register(req: express.Request, res: express.Response, next: express.NextFunction){
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) return next(err);
        if (!user) return next(400);
        else res.status(200).send();
    })(req, res, next);  
};

export function authenticate(req: any, res: any, next: express.NextFunction){
    if (req.isAuthenticated()) res.status(200).send({token: signToken(req.user)});
    res.send(200);
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
            res.status(201).send();
        }
    });
};

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
                    .then(function (){ res.status(200).send(); })
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

////////////////////////////////////////////////////////////////////////////////////////////////
    
/** Sign token with user credentials in it */
function signToken(user){
    if (!user) return null;
    return jwt.sign(user, SECRET, {
        expiresIn: '24hr' // expires in 24 hours
    });
};