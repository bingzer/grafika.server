import * as express from "express";
import { IServerSync, ILocalSync } from "../models/sync";
import { Synchronizer, SyncResult } from "../libs/synchronizer";

/**
 * Clients call this POST with LocalSync to get the result.
 * The result is a SyncResult object that tells client what to do (i.e: ClientPush, ClientPull, ClientDelete).
 * 
 * After client has performed this action. Client should then call, syncUpdate() to update
 * the 'dateModified' field in the server side.
 */
export function sync(req: any, res: express.Response, next: express.NextFunction) {
    let userId = req.user._id;
    let localSync: ILocalSync = req.body;
    if (!localSync) return next(400);
    
    localSync.userId = userId;  // force it
    if (!localSync.animations || !localSync.clientId)
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

/**
 * Client call this POST with LocalSync object to update 'dateModified' field on the server side.
 * The server remembers the 'clientId' (from LocalSync object) to match up the sync.
 * If everything goes well, the server will update the dateModified field
 */
export function syncUpdate(req: any | express.Request, res: express.Response, next: express.NextFunction) {
    let userId = req.user._id;
    let localSync: ILocalSync = req.body.sync;
    let syncResult: SyncResult = req.body.result;
    if (!localSync || !syncResult) return next(400);

    let synchronizer = new Synchronizer(localSync);
    synchronizer.sync()
        .then(() => res.sendStatus(201))
        .catch((err) => next(err));
}