import * as express from "express";
import { IServerSync, Sync, ILocalSync } from "../models/sync";
import { Synchronizer } from "../libs/synchronizer";

export function sync(req: any, res: express.Response, next: express.NextFunction) {
    let userId = req.user._id;
    let localSync: ILocalSync = req.body;
    if (!localSync) return next(400);
    
    localSync._id = userId;  // force it
    if (!localSync.animationIds || !localSync.dateModified)
        return next(400);

    var synchronizer = new Synchronizer(localSync);
    synchronizer.sync((err, syncResult) => {
        if (err) return next(err);
        
        res.send(syncResult);
    });
}