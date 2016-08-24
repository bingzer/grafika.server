import * as express from "express";
import { IUser, User, sanitize, checkAvailability, isAdministrator } from "../models/user";

export function get(req: express.Request | any, res: express.Response, next: express.NextFunction) {
    let userId = req.params._id;
    let sameUser = (req.user && req.user._id.toString() == userId);
    let isAdmin = isAdministrator(req.user);

    User.findById(userId, (err, user) => {
        if (!user) err = 404;
        if (err) return next(err);

        user = user.sanitize();
        
        if (!sameUser && !isAdmin)
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
    User.findOne(req.params._id, (err, user) => {
        if (err) return next(err);
        if (!user) return next(404);
        res.redirect(user.prefs.avatar);
    });
};