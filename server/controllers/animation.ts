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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////