import * as express from "express";

import * as config from '../configs/config';

import { AwsUsers } from '../libs/aws';
import { IUser, User, sanitize, checkAvailability, isAdministrator } from "../models/user";

const aws = new AwsUsers();

export function get(req: express.Request | any, res: express.Response, next: express.NextFunction) {
    let userId = req.params._id;
    let isAdmin = isAdministrator(req.user);

    User.findById(userId, (err, user) => {
        if (!user) err = 404;
        if (err) return next(err);

        user = user.sanitize();
        
        if (!req.user || ((req.user && req.user._id.toString() !== user._id.toString()) && !isAdmin))
            delete user.email;
            
        res.send(user);
    });
}

export function update(req: express.Request | any, res: express.Response, next: express.NextFunction) {
    if (!req.body || !req.params._id) return next();

    let userId = req.params._id;
    let user: any = { email: req.user.email, dateModified: Date.now() };
     
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.username) user.username = req.body.username;
    if (req.body.prefs) {
        user.prefs = {};
        if (req.body.prefs.avatar) user.prefs.avatar = req.body.prefs.avatar;
        if (req.body.prefs.backdrop) user.prefs.backdrop = req.body.prefs.backdrop;
        if (req.body.prefs.playbackLoop) user.prefs.playbackLoop = req.body.prefs.playbackLoop;
        if (req.body.prefs.drawingTimer) user.prefs.drawingTimer = req.body.prefs.drawingTimer;
        if (req.body.prefs.drawingIsPublic) user.prefs.drawingIsPublic = req.body.prefs.drawingIsPublic;
    }
    
    checkAvailability(user).then(() => {
        User.findOneAndUpdate({ _id: userId}, user, (err, user) => {
            if (!user) err = 404;
            if (err) return next(err);

            res.sendStatus(200);
        });
    }, (error) => next(error));
}

export function getAvatar(req: express.Request | any, res: express.Response, next: express.NextFunction) {
    User.findById(req.params._id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect(`${config.setting.$content.$url}assets/img/ic_user.png`);
        res.redirect(user.prefs.avatar);
    });
};

export function createAvatarSignedUrl(req : express.Request | any, res : express.Response, next: express.NextFunction) {
    let userId = req.user._id;
    let mimeType = req.body.mime;
    let imageType = req.body.imageType;
    if (!userId || !mimeType || !imageType) return next("User, ImageType or Mime type must be specified in the request body");

    User.findById(userId, (err, user) => {
        if (err) return next(err);
        else if (!user) return next(404);
        
        aws.createSignedUrl(user, imageType, mimeType)
            .then((signedUrl) => res.send(signedUrl))
            .catch(next);
    });
};