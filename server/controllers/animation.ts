import * as express from "express";
import * as q from 'q';

import { Animation, IAnimation } from "../models/animation";
import { AwsAnimation, AwsResources } from '../libs/aws';

export function remove(req: express.Request, res: express.Response, next: express.NextFunction) {
    Animation.findByIdAndUpdate(req.params._id, { removed: true }, (err, anim) => {
        if (err) return next(err);
        if (!anim) return next(404);
        return res.sendStatus(200);
    });
}

export function incrementViewCount(req: express.Request, res: express.Response, next: express.NextFunction) {
    Animation.findByIdAndUpdate(req.params._id, {$inc: { views: 1 }}, (err, anim) => {
        if (err) return next(err);
        if (!anim) return next(404);
        return res.sendStatus(200);
    });
}

export function submitRating(req: express.Request, res: express.Response, next: express.NextFunction) {
    let rating = parseInt(req.params.rating);
    if (!rating) return next(400);
    if (rating <= 0 && rating >= 5) return next(400);

    Animation.findById(req.params._id, { frames: 0 }, (err, anim) => {
        if (err) return next(err);
        if (!anim) return next(404);
        
        anim.rating = (anim.rating + rating) / 2;
        anim.save((err, result: Grafika.IAnimation) => {
            if (err) return next(err);
            res.send(201, result.rating);
        });
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////