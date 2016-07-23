import * as express from "express";
import { IUser, User, sanitize, checkAvailability } from "../models/user";

export function get(req: express.Request, res: express.Response, next: express.NextFunction) {
    var userId = req.params._id;
    User.findById(userId, (err, user) => {
        if (!user) err = 404;
        if (err) return next(err);
        
        res.send(sanitize(user));
    });
}

export function update(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.body || !req.params._id) return next();

    var userId = req.params._id;
    var user: any = { dateModified: Date.now() };
     
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.firstName) user.firstName = req.body.firstName;
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

            res.send(200);
        });
    }, (error) => next(error));
}