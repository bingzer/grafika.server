import { Sync, ISync, IServerSync, ILocalSync } from '../models/sync';
import { Animation, IAnimation } from '../models/animation';
import { User } from '../models/user';
import * as _ from 'underscore';
import * as q from 'q';
import * as winston from 'winston';
import * as mongoose from 'mongoose';

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
    ClientDelete,

    /**
     * Server delete. Client should not do anything
     */
    ServerDelete
}

export class SyncEvent {
    constructor(
        public action: SyncAction, 
        public animationId: string, 
        public localId: string)
    {
        // nothing
    }

    display(): string {
        let str: string = 'Action=' + this.action + ' ';
        switch (this.action) {
            case SyncAction.Ok: str += "[Ok]"; break;
            case SyncAction.ClientPull: str += "[ClientPull]"; break;
            case SyncAction.ClientPush: str += "[ClientPush]"; break;
            case SyncAction.ClientDelete: str += "[ClientDelete]"; break;
            case SyncAction.ServerDelete: str += "[ServerDelete]"; break;
            default: str += "[Unknown]"; break;
        }

        str += ' AnimationId=' + this.animationId + ' LocalId=' + this.localId; 
        return str;
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

    addSyncEvent(event: SyncEvent) {
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].animationId == event.animationId)
                return;
        }

        this.events.push(event);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class Synchronizer implements ISyncProcess {

    private localSync: ILocalSync;
    private serverSync: IServerSync;
    private syncResult: SyncResult;
    private syncProcesses: ISyncProcess[] = [];

    constructor(localSync: ILocalSync){
        this.localSync = localSync;
        this.syncResult = new SyncResult(localSync.clientId);
    }

    /**
     * Synchronize
     */
    sync(): q.Promise<SyncResult> {
        winston.info("Sync: Started");
        winston.info("Sync: ClientID = " + this.localSync.clientId);
        winston.info("Sync: Id = " + this.localSync._id);

        let preparationProcess: Preparation = new Preparation(this.syncResult, this.localSync);
        let additionProcess: Addition = new Addition(this.syncResult, this.localSync);
        let deletionProcess: Deletion = new Deletion(this.syncResult, this.localSync);
        let modificationProcess: Modification = new Modification(this.syncResult, this.localSync);
        let finalizationProcess: Finalization = new Finalization(this.syncResult, this.localSync);

        return preparationProcess.sync()
            .then((SyncResult) => {
                return additionProcess.sync();
            })
            .then((SyncResult) => {
                return deletionProcess.sync();
            })
            .then((syncResult) => {
                return modificationProcess.sync();
            })
            .then((SyncResult) => {
                return finalizationProcess.sync();
            })
            .finally(() => {
                winston.info('Sync: ' + this.syncResult.display());
                winston.info("Sync: Done!!!!!")
                return q.when(this.syncResult);
            });
    }
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ISyncProcess {
    sync(): q.Promise<SyncResult>
}

abstract class SyncProcess implements ISyncProcess {
    constructor(
        private name: string,
        protected syncResult: SyncResult,
        protected localSync: ILocalSync
    ){
        // nothing
    }

    protected log(msg: string) {
        winston.info("Sync: [" + this.name + "] " + msg);
    }

    protected abstract doSync(defer: q.Deferred<SyncResult>, localSync: ILocalSync, serverSync: IServerSync);

    ///////////////////////////////////////////////////////////////////////////////

    sync(): q.Promise<SyncResult> {
        let defer = q.defer<SyncResult>();

        Sync.findById(this.localSync._id, (err, serverSync: IServerSync) => {
            if (err) defer.reject(err);
            if (!serverSync) {
                let sync = new Sync();
                sync._id = this.localSync._id;
                sync.dateCreated = Date.now();
                sync.dateModified = this.localSync.dateModified - 100;
                sync.animationIds = [];
                sync.save((err, res) => {
                    if (err) defer.reject(err);
                    else if (!res) defer.reject('Unable to create Sync entity');
                    else this.executeSync(defer, <IServerSync> res);
                });
            }
            else {
                this.executeSync(defer, serverSync);
            }
        });
        return defer.promise;
    }

    private executeSync(defer: q.Deferred<SyncResult>, serverSync: IServerSync){
        let ids = _.map(serverSync.animationIds, (animationId) => new mongoose.Types.ObjectId(animationId));
        Animation.find({ _id: { $in: ids }}).lean(true).exec((err, serverAnimations) => {
            if (err) defer.reject(err);
            else {
                serverSync.animations = serverAnimations;
                this.doSync(defer, this.localSync, serverSync);
            }
        });
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Preparation extends SyncProcess {
    constructor(syncResult: SyncResult, localSync: ILocalSync) {
        super("Preparation", syncResult, localSync);
    }
    
    doSync(defer: q.Deferred<SyncResult>, localSync: ILocalSync, serverSync: IServerSync) {
        this.log("Preparation");

        return this.checkUser()
            .then(() => defer.resolve(this.syncResult))
            .catch((err) => {
                defer.reject(err);
            });
    }

    private checkUser(): q.Promise<any> {
        this.log("Check user");
        let defer = q.defer();
        // make sure user exists
        User.findOne({ _id: this.localSync._id, active: true }, (err, user) => {
            if (err) defer.reject(err);
            else if (!user) defer.reject('User not found');
            else {
                defer.resolve();
            }
        });
        return defer.promise;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Addition extends SyncProcess {
    constructor(syncResult: SyncResult, localSync: ILocalSync) {
        super("Addition", syncResult, localSync);
    }
    
    doSync(defer: q.Deferred<SyncResult>, localSync: ILocalSync, serverSync: IServerSync) {
        this.log("Addition check");
          
        if (serverSync.dateModified > this.localSync.dateModified) {
            this.log("Server is more current");

            let addLocalIds =_.difference(_.map(serverSync.animations, (anim) => anim._id.toString()), _.map(localSync.animations, (anim) => anim._id.toString()));
            let addLocals = _.filter(serverSync.animations, (anim) => _.contains(addLocalIds, anim._id.toString()));
            for (let i = 0; i < addLocals.length; i++) {
                let addLocal = addLocals[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientPull, addLocal._id, addLocal.localId));
            }

            defer.resolve(this.syncResult);
        }
        else if (this.localSync.dateModified > serverSync.dateModified) {
            this.log("Client is more current");

            let addRemoteIds =_.difference(_.map(localSync.animations, (anim) => anim.localId.toString()), _.map(serverSync.animations, (anim) => anim.localId.toString()));
            let addRemotes = _.filter(localSync.animations, (anim) => _.contains(addRemoteIds, anim.localId.toString()));
            for (let i = 0; i < addRemotes.length; i++) {
                let addRemote = addRemotes[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientPush, addRemote._id, addRemote.localId));
            }

            defer.resolve(this.syncResult);
        }
        else {
            this.log("Server and Client are up-to-date");
            defer.resolve(this.syncResult);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Deletion extends SyncProcess {

    constructor(syncResult: SyncResult, localSync: ILocalSync) {
        super("Deletion", syncResult, localSync);
    }

    doSync(defer: q.Deferred<SyncResult>, localSync: ILocalSync, serverSync: IServerSync) {
        this.log("Deletion check");  
        if (serverSync.dateModified > this.localSync.dateModified) {
            this.log("Server is more current");
            
            let deleteLocalIds = _.difference(_.map(localSync.animations, (anim) => anim._id.toString()), _.map(serverSync.animations, (anim) => anim._id.toString()));
            let deleteLocals = _.filter(localSync.animations, (anim) => _.contains(deleteLocalIds, anim._id.toString()));
            for (let i = 0; i < deleteLocals.length; i++) {
                let deleteLocal = deleteLocals[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientDelete, deleteLocal._id, deleteLocal.localId));
            }

            defer.resolve(this.syncResult);
        }
        else if (this.localSync.dateModified > serverSync.dateModified) {
            this.log("Client is more current");

            let deleteRemoteLocalIds = _.difference(_.map(serverSync.animations, (anim) => anim.localId.toString()), _.map(localSync.animations, (anim) => anim.localId.toString())); 
            let deleteRemotes = _.filter(serverSync.animations, (anim) => _.contains(deleteRemoteLocalIds, anim.localId.toString()));
            let deleteRemoteIds = _.map(deleteRemotes, (anim) => anim._id);
            for (let i = 0; i < deleteRemotes.length; i++) {
                let deleteRemote = deleteRemotes[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ServerDelete, deleteRemote._id, deleteRemote.localId));
            }

            if (deleteRemoteIds.length > 0) {
                Animation.remove({_id: { $in: deleteRemoteIds }}, (err) => {
                    if (err) defer.reject(err);
                    else {
                        serverSync.animationIds = _.difference(serverSync.animationIds, deleteRemoteIds);
                        serverSync.save((err, res) => {
                            if (err) defer.reject(err);
                            else defer.resolve(this.syncResult);
                        });
                    }
                });
            }
            else { 
                defer.resolve(this.syncResult);
            }
        }
        else {
            this.log("Server and Client are up-to-date");
            defer.resolve(this.syncResult);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Modification extends SyncProcess {

    constructor(syncResult: SyncResult, localSync: ILocalSync) {
        super("Modification", syncResult, localSync);
    }
    
    doSync(defer: q.Deferred<SyncResult>, localSync: ILocalSync, serverSync: IServerSync) {
        this.log("DateModified check");
          
        for(let i = 0; i < serverSync.animations.length; i++) {
            let remote = serverSync.animations[i];
            let event = new SyncEvent(SyncAction.Ok, remote._id, remote.localId);

            for (let j = 0; j < localSync.animations.length; j++) {
                let local = localSync.animations[j];
                // if exists
                if (remote._id == local._id) {
                    if (remote.dateModified > local.dateModified)
                        event.action = SyncAction.ClientPull;
                    else if (remote.dateModified < local.dateModified)
                        event.action = SyncAction.ClientPush;
                    break;
                }
            }// end for j

            if (event.action != SyncAction.Ok)
                this.syncResult.addSyncEvent(event);
        }

        defer.resolve(this.syncResult);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Finalization extends SyncProcess {
    constructor(syncResult: SyncResult, localSync: ILocalSync) {
        super("ServerSyncUpdate", syncResult, localSync);
    }
    
    doSync(defer: q.Deferred<SyncResult>, localSync: ILocalSync, serverSync: IServerSync) {
        this.log('Updating ServerSync.dateModified');
        serverSync.dateModified = this.localSync.dateModified;
        serverSync.save((err, res) => {
            if (err) defer.reject(err);
            else {
                defer.resolve(this.syncResult);
                this.log('ServerSync.dateModified Updated');
            }
        });
    }
}