import * as express from "express";
import { IServerSync, Sync, ILocalSync } from "../models/sync";
import { Synchronizer } from "../libs/synchronizer";

export function sync(req: any, res: express.Response, next: express.NextFunction) {
    let userId = req.user._id;
    let localSync: ILocalSync = req.body;
    if (!localSync) return next(400);
    
    localSync._id = userId;  // force it
    if (!localSync.animations || !localSync.dateModified || !localSync.clientId)
        return next(400);

    var synchronizer = new Synchronizer(localSync);
    synchronizer
        .sync()
        .then((syncResult) => {
            res.send(syncResult);
        })
        .catch((err) => {
            next(err);
        });
}