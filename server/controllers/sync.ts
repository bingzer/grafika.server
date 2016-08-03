import * as express from "express";
import { IServerSync, Sync, ILocalSync } from "../models/sync";
import { Synchronizer } from "../libs/synchronizer";
import * as _ from 'underscore';

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

/**
 * Client call this POST with LocalSync object to update 'dateModified' field on the server side.
 * The server remembers the 'clientId' (from LocalSync object) to match up the sync.
 * If everything goes well, the server will update the dateModified field
 */
export function syncUpdate(req: any | express.Request, res: express.Response, next: express.NextFunction) {
    let userId = req.user._id;
    let localSync: ILocalSync = req.body;
    if (!localSync) return next(400);

    localSync._id = userId;  // force it
    Sync.findOne({_id: localSync._id, $or: [{ clientId: localSync.clientId }, { clientId: null }] }, (err, result) => {
        if (err) next(result);
        else if(!result) {
            next('Unable to find ServerSync. Detail: ' + err);
        }
        else {
            let match = result.clientId === localSync.clientId;
            if (result.clientId) 
                result.dateModified = localSync.dateModified;
            result.clientId = undefined;
            result.animationIds = _.map(localSync.animations, (anim: Grafika.IAnimation) => anim._id);
            result.save((err) => {
                if (err) next(err);
                else if (!match) next('No matching clientId found'); 
                else res.sendStatus(201);
            })
        }
    });
}