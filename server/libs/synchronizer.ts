import { Sync, ISync, IServerSync, ILocalSync } from '../models/sync';
import { Animation, IAnimation } from '../models/animation';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export enum SyncAction {
    /**
     * Nothing to be done
     */
    Ok,

    /**
     * Client should pull the animation from the server
     */
    ClientPull,

    /**
     * Client should push the animation to the server
     */
    ClientPush,

    /**
     * Client should delete the local copy
     */
    ClientDelete
}

export class SyncEvent {
    constructor(
        public action: SyncAction, 
        public animationId: string, 
        public localId: string)
    {
        // nothing
    }
}

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
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class Synchronizer {

    private localSync: ILocalSync;
    private localAnimations: Grafika.IAnimation[];
    private serverSync: IServerSync;
    private serverAnimations: Grafika.IAnimation[];
    private syncResult: SyncResult;

    constructor(localSync: ILocalSync){
        this.localSync = localSync;
        this.localAnimations = localSync.animations;
        this.syncResult = new SyncResult(localSync.clientId);
    }

    /**
     * Synchronize
     */
    sync(callback: (err: any, result: SyncResult) => void) {
        Sync.findById(this.localSync._id, (err, serverSync) => {
            if (err) return callback(err, this.syncResult);
            if (!serverSync) return callback(err, this.syncResult);

            this.serverSync = serverSync;
            Animation.find({ _id: { $in: this.serverSync.animationIds }}, (err, remoteAnimations) => {
                if (err) return callback(err, this.syncResult);

                this.serverAnimations = remoteAnimations;
                this.checkDeleted();
                this.checkDateModified();

                this.syncResult.syncDate = Date.now();
                this.serverSync.dateModified = this.syncResult.syncDate;
                this.serverSync.save();

                callback(err, this.syncResult);
            });
        });
    }

    private checkDateModified() {
        for(let i = 0; i < this.serverAnimations.length; i++) {
            let remote = this.serverAnimations[i];
            let event = new SyncEvent(SyncAction.Ok, remote._id, remote.localId);

            let localExists = false;
            for (let j = 0; j < this.localAnimations.length; j++) {
                let local = this.localAnimations[j];
                // if exists
                if (remote._id == local._id) {
                    if (remote.dateModified > local.dateModified)
                        event.action = SyncAction.ClientPull;
                    else if (remote.dateModified < local.dateModified)
                        event.action = SyncAction.ClientPush;
                    localExists = true;
                    break;
                }
            }// end for j

            if (!localExists) {
                event.action = SyncAction.ClientPull;
            }

            if (event.action != SyncAction.Ok)
                this.addSyncEvent(event);
        }
    } // end sync()

    private checkDeleted() {
        if (this.serverSync.dateModified > this.localSync.dateModified) {
            // check remote
            for (let i = 0; i < this.serverAnimations.length; i++) {
                let remoteAnim = this.serverAnimations[i];
                let event = new SyncEvent(SyncAction.Ok, remoteAnim._id, remoteAnim.localId);

                let foundLocal = false;
                for (let j = 0; j < this.localAnimations.length; j++) {
                    let localAnim = this.localAnimations[j];
                    if (remoteAnim._id == localAnim._id) {
                        foundLocal = true;
                        break;
                    }
                }

                if (!foundLocal) {
                    event.action = SyncAction.ClientPull;
                }

                if (event.action != SyncAction.Ok)
                    this.addSyncEvent(event);
            }
        }
        else if (this.serverSync.dateModified < this.localSync.dateModified) {
            // check local
            for (let i = 0; i < this.localAnimations.length; i++) {
                let localAnim = this.localAnimations[i];
                let event = new SyncEvent(SyncAction.Ok, localAnim._id, localAnim.localId);

                let foundRemote = false;
                for (let j = 0; j < this.serverAnimations.length; j++) {
                    let remoteAnim = this.serverAnimations[j];
                    if (localAnim._id == remoteAnim._id) {
                        foundRemote = true;
                        break;
                    }
                }

                if (!foundRemote) {
                    event.action = SyncAction.ClientPush;
                }

                if (event.action != SyncAction.Ok)
                    this.addSyncEvent(event);
            }
        }

    }// end checkDeleted

    private addSyncEvent(event: SyncEvent) {
        for (let i = 0; i < this.syncResult.events.length; i++) {
            if (this.syncResult.events[i].animationId == event.animationId)
                return;
        }

        this.syncResult.events.push(event);
    }
}