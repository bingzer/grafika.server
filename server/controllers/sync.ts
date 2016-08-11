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
    let localSync: ILocalSync = req.body;

    let synchronizer = new Synchronizer(req.user, localSync);
    synchronizer.sync()
        .then((syncResult) => res.send(syncResult))
        .catch((err) => next(err) );
}

/**
 * Client call this POST with LocalSync object to update 'dateModified' field on the server side.
 * The server remembers the 'clientId' (from LocalSync object) to match up the sync.
 * If everything goes well, the server will update the dateModified field
 */
export function syncUpdate(req: any | express.Request, res: express.Response, next: express.NextFunction) {
    let localSync: ILocalSync = req.body.sync;
    let syncResult: SyncResult = req.body.result;
    let synchronizer = new Synchronizer(req.user, localSync);

    if (!localSync || !syncResult) 
        return next(new Error("sync and/ result are required"));

    synchronizer.syncUpdate(syncResult)
        .then(() => res.sendStatus(201))
        .catch((err) => next(err));
}