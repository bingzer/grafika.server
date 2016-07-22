import { UserAnimation, IUserAnimation, ILocalUserAnimation } from '../models/user-animation';
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
    /**
     * The animation
     */
    animationId: string;

    /**
     * Local id
     */
    localId: string,

    /**
     * The event
     */
    action: SyncAction;
}

export class SyncResult {
    /**
     * Collections of events need to be done
     */
    events: SyncEvent[] = [];
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class Synchronizer {

    private localUserAnim: ILocalUserAnimation;
    private localAnimations: Grafika.IAnimation[];
    private remoteUserAnim: IUserAnimation;
    private remoteAnimations: Grafika.IAnimation[];
    private syncResult: SyncResult = new SyncResult();

    constructor(localUserAnim: ILocalUserAnimation){
        this.localUserAnim = localUserAnim;
        this.localAnimations = localUserAnim.animations;
    }

    /**
     * Synchronize
     */
    sync(callback: (err: any, result: SyncResult) => void) {
        UserAnimation.findById(this.localUserAnim._id, (err, remoteUserAnim) => {
            if (err) return callback(err, this.syncResult);

            this.remoteUserAnim = remoteUserAnim;
            Animation.find({ _id: { $in: remoteUserAnim.animationIds }}, (err, remoteAnimations) => {
                if (err) return callback(err, this.syncResult);

                this.remoteAnimations = remoteAnimations;
                this.checkDateModified();
                this.checkDeleted();

                callback(err, this.syncResult);
            });
        });
    }

    private checkDateModified() {
        for(let i = 0; i < this.remoteAnimations.length; i++) {
            let event = new SyncEvent();
            let remote = this.remoteAnimations[i];
            
            event.animationId = remote._id;
            event.action = SyncAction.Ok;
            event.localId = remote.localId;

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
        if (this.remoteUserAnim.dateModified > this.localUserAnim.dateModified) {
            // check remote
            for (let i = 0; i < this.remoteUserAnim.animationIds.length; i++) {
                let remoteAnim = this.remoteUserAnim.animationIds[i];
                let event = new SyncEvent();
                event.animationId = remoteAnim;
                event.action = SyncAction.Ok;
                //event.localId = 'remote.localId';

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
        else if (this.remoteUserAnim.dateModified < this.localUserAnim.dateModified) {
            // check local
            for (let i = 0; i < this.localAnimations.length; i++) {
                let localAnim = this.localAnimations[i];
                let event = new SyncEvent();
                event.animationId = localAnim._id;
                event.action = SyncAction.Ok;
                event.localId = localAnim.localId;

                let foundRemote = false;
                for (let j = 0; j < this.remoteUserAnim.animationIds.length; j++) {
                    let remoteAnim = this.remoteUserAnim.animationIds[j];
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