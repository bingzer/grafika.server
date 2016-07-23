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
        public localId?: string)
    {
        // nothing
    }
}

export class SyncResult {
    /**
     * Collections of events need to be done
     */
    events: SyncEvent[] = [];
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class Synchronizer {

    private localSync: ILocalSync;
    private localAnimations: Grafika.IAnimation[];
    private serverSync: IServerSync;
    private serverAnimations: Grafika.IAnimation[];
    private syncResult: SyncResult = new SyncResult();

    constructor(localUserAnim: ILocalSync){
        this.localSync = localUserAnim;
        this.localAnimations = localUserAnim.animations;
    }

    /**
     * Synchronize
     */
    sync(callback: (err: any, result: SyncResult) => void) {
        Sync.findById(this.localSync._id, (err, remoteUserAnim) => {
            if (err) return callback(err, this.syncResult);

            this.serverSync = remoteUserAnim;
            Animation.find({ _id: { $in: this.serverSync.animationIds }}, (err, remoteAnimations) => {
                if (err) return callback(err, this.syncResult);

                this.serverAnimations = remoteAnimations;
                this.checkDateModified();
                this.checkDeleted();

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
                this.syncResult.events.push(event);
        }
    } // end sync()

    private checkDeleted() {
        if (this.serverSync.dateModified > this.localSync.dateModified) {
            // check remote
            for (let i = 0; i < this.serverSync.animationIds.length; i++) {
                let remoteAnim = this.serverSync.animationIds[i];
                let event = new SyncEvent(SyncAction.Ok, remoteAnim);

                let foundLocal = false;
                for (let j = 0; j < this.localAnimations.length; j++) {
                    let localAnim = this.localAnimations[j];
                    if (remoteAnim === localAnim._id) {
                        event.localId = localAnim.localId;
                        foundLocal = true;
                        break;
                    }
                }

                if (!foundLocal) {
                    event.action = SyncAction.ClientPull;
                }

                if (event.action != SyncAction.Ok)
                    this.syncResult.events.push(event);
            }
        }
        else if (this.serverSync.dateModified < this.localSync.dateModified) {
            // check local
            for (let i = 0; i < this.localAnimations.length; i++) {
                let localAnim = this.localAnimations[i];
                let event = new SyncEvent(SyncAction.Ok, localAnim._id, localAnim.localId);

                let foundRemote = false;
                for (let j = 0; j < this.serverSync.animationIds.length; j++) {
                    let remoteAnim = this.serverSync.animationIds[j];
                    if (localAnim._id === remoteAnim) {
                        foundRemote = true;
                        break;
                    }
                }

                if (!foundRemote) {
                    event.action = SyncAction.ClientPush;
                }

                if (event.action != SyncAction.Ok)
                    this.syncResult.events.push(event);
            }
        }

    }// end checkDeleted
}