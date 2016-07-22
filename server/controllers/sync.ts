import * as express from "express";
import { IUserAnimation, UserAnimation, ILocalUserAnimation } from "../models/user-animation";
import { Synchronizer } from "../libs/synchronizer";

export function sync(req: any, res: express.Response, next: express.NextFunction) {
    let userId = req.user._id;
    let localUserAnim: ILocalUserAnimation = req.body.userAnimation;
    if (!localUserAnim) return next(400);

    localUserAnim._id = userId;  // force it

    var synchronizer = new Synchronizer(localUserAnim);
    synchronizer.sync((err, syncResult) => {
        if (err) return next(err);
        
        res.send(syncResult);
    });
}