import * as _ from 'underscore';
import * as q from 'q';
import * as winston from 'winston';
import * as mongoose from 'mongoose';

import { ISync, IServerSync, ServerSync, ILocalSync } from '../models/sync';
import { Animation, IAnimation } from '../models/animation';
import { User } from '../models/user';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class Synchronizer {
    constructor(private localSync: ILocalSync) {
        // do nothing
    }

    sync() : q.Promise<SyncResult> {
        let result = new SyncResult(this.localSync.clientId);

        let preparation = new Preparation(result);
        let addition = new Addition(result);
        let modification = new Modification(result);
        let deletion = new Deletion(result);
        let finalization = new Finalization(result);

        return ServerSync.find(this.localSync.userId)
            .then((serverSync) => {
                return preparation.sync(this.localSync, serverSync)
                    .then((result) => addition.sync(this.localSync, serverSync))
                    .then((result) => modification.sync(this.localSync, serverSync))
                    .then((result) => deletion.sync(this.localSync, serverSync))
                    .then((result) => finalization.sync(this.localSync, serverSync));
            });
    }

    syncUpdate(syncResult: SyncResult): q.Promise<any> {
        let defer = q.defer();

        // handles all delete
        let serverDeleteEvents = _.filter(syncResult.events, (event) => event.action === SyncAction.ServerDelete);
        let serverDeleteIds = _.map(syncResult.events, (event) => event.animationId);

        Animation.remove( { _id: { $in: serverDeleteIds }}, (err) => {
            if (err) defer.reject(err);
            else defer.resolve();
        });
        
        return defer.promise;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ISyncProcess {
    sync(localSync: ILocalSync, serverSync: IServerSync): q.Promise<SyncResult>;
}

abstract class InternalSyncProcess implements ISyncProcess {
    constructor(protected syncResult: SyncResult) {
        // nothing
    }

    sync(localSync: ILocalSync, serverSync: IServerSync): q.Promise<SyncResult> {
        let defer = q.defer<SyncResult>();
        
        q.delay(500).then(() => {
            try {
                this.executeSync(localSync, serverSync);
                q.resolve(this.syncResult);
            }
            catch (e) {
                q.reject(e);
            }
        });

        return defer.promise;
    }

    protected abstract executeSync(localSync: ILocalSync, serverSync: IServerSync): void;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Preparation extends InternalSyncProcess {
    constructor(syncResult: SyncResult) {
        super(syncResult);
    }

    protected executeSync(localSync: ILocalSync, serverSync: IServerSync){
        log("Preparation");
    }
}

class Modification extends InternalSyncProcess {
    constructor(syncResult: SyncResult) {
        super(syncResult);
    }

    protected executeSync(localSync: ILocalSync, serverSync: IServerSync){
        log("Modification");

        for (let i = 0; i < localSync.animations.length; i++) {
            let localAnim = localSync.animations[i];
            for (let j = 0; j < serverSync.animations.length; j++) {
                let serverAnim = serverSync.animations[j];

                if (localAnim._id == serverAnim._id) {
                    if (localAnim.dateModified < serverAnim.dateModified)
                        this.syncResult.addAction(SyncAction.ClientOutOfDate, localAnim);
                    if (localAnim.dateModified > serverAnim.dateModified)
                        this.syncResult.addAction(SyncAction.ServerOutOfDate, localAnim);
                    break;
                }
            }// end j
        }// end i
    }
}

class Deletion extends InternalSyncProcess {    
    constructor(syncResult: SyncResult) {
        super(syncResult);
    }
    
    protected executeSync(localSync: ILocalSync, serverSync: IServerSync){
        log("Deletion");

        // Local deletions
        for (let i = 0; i < localSync.tombstones.length; i++) {
            let localAnim = localSync.animations[i];
            for (let j = 0; j < serverSync.animations.length; j++) {
                let serverAnim = serverSync.animations[j];

                if (localAnim._id == serverAnim._id) {
                    this.syncResult.addAction(SyncAction.ServerDelete, serverAnim);
                    break;
                }
            }
        }// end i

        // server deletions
        for (let i = 0; i < serverSync.tombstones.length; i++) {
            let localAnim = localSync.animations[i];
            for (let j = 0; j < localSync.animations.length; j++) {
                let serverAnim = serverSync.animations[j];

                if (localAnim._id == serverAnim._id) {
                    this.syncResult.addAction(SyncAction.ClientDelete, localAnim);
                    break;
                }
            }
        }
    }
}

class Addition extends InternalSyncProcess {
    constructor(syncResult: SyncResult) {
        super(syncResult);
    }
    
    protected executeSync(localSync: ILocalSync, serverSync: IServerSync){
        log("Addition");

        // local addition
        for (let i = 0; i < localSync.animations.length; i++) {
            let localAnim = localSync.animations[i];
            let serverMissing = true;

            for (let j = 0; j < serverSync.animations.length; j++) {
                let serverAnim = serverSync.animations[j];
                
                if (localAnim._id == serverAnim._id) {
                    serverMissing = false;
                    break;
                }
            }// end j

            if (serverMissing) {
                this.syncResult.addAction(SyncAction.ServerMissing, localAnim);
            }
        }// end i

        // server addition
        for (let i = 0; i < serverSync.animations.length; i++) {
            let serverAnim = serverSync.animations[i];
            let clientMissing = true;

            for (let j = 0; j < localSync.animations.length; j++) {
                let localAnim = localSync.animations[j];

                if (serverAnim._id == localAnim._id) {
                    clientMissing = false;
                    break;
                }
            }

            if (clientMissing) {
                this.syncResult.addAction(SyncAction.ClientMissing, serverAnim);
            }
        }// end i
    }
}

class Finalization extends InternalSyncProcess {
    constructor(syncResult: SyncResult) {
        super(syncResult);
    }
    
    executeSync(localSync: ILocalSync, serverSync: IServerSync){
        log("Finalization");
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export enum SyncAction {
    /**
     * Nothing to be done
     */
    Ok,
    
    /**
     * Client needs to pull and update
     */
    ClientOutOfDate,

    /**
     * Clients needs to create and then pull for update
     */
    ClientMissing,

    /**
     * Clients should delete its animation
     */
    ClientDelete,

    /**
     * Server is missing this animation
     */
    ServerMissing,

    /**
     * Server is out of date. Needs to be updated
     */
    ServerOutOfDate,

    /**
     * Server needs to delete the animation
     */
    ServerDelete
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class SyncEvent {
    constructor(
        public action: SyncAction, 
        public animationId: string)
    {
        // nothing
    }

    display(): string {
        let str: string = 'Action=' + this.action + ' ';
        switch (this.action) {
            case SyncAction.Ok: str += "[Ok]"; break;
            case SyncAction.ClientDelete: str += "[ClientDelete]"; break;
            case SyncAction.ClientOutOfDate: str += "[ClientOutOfDate]"; break;
            case SyncAction.ClientMissing: str += "[ClientMissing]"; break;
            case SyncAction.ServerDelete: str += "[ServerDelete]"; break;
            case SyncAction.ServerOutOfDate: str += "[ServerOutOfDate]"; break;
            case SyncAction.ServerDelete: str += "[ServerDelete]"; break;
            default: str += "[Unknown]"; break;
        }

        str += ' AnimationId=' + this.animationId;
        return str;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class SyncResult {
    /**
     * Client id
     */
    clientId: string;

    /**
     * Sync date
     */
    syncDate: number = Date.now();

    /**
     * Collections of events need to be done
     */
    events: SyncEvent[] = [];

    constructor(clientId: string) {
        this.clientId = clientId;
    }

    addAction(action: SyncAction, animation: Grafika.IAnimation) {
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].animationId == animation._id)
                return;
        }

        this.events.push(new SyncEvent(action, animation._id));
    }

    display(): string {
        let str: string = 'SyncResult:'
        if (this.events.length > 0) {
            for (let i = 0; i < this.events.length; i++) {
                str += '\n\t' + this.events[i].display();
            }
        }
        else {
            str += '\n\tNo Sync Event';
        }
        return str;
    }
}

function log(msg: string | any) {
    winston.info('[Sync]' + msg);
}