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
            if (this.events[i].animationId == event.animationId || this.events[i].localId == event.localId)
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

/**
 * This class is responsible to perform sync between server and client.
 */
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
     * Synchronize and returns SyncResult.
     * For each animation, there can ONLY BE ONE action (ie: Add, Delete, Modified)
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
            .then((SyncResult) => deletionProcess.sync())
            .then((SyncResult) => additionProcess.sync())
            .then((syncResult) => modificationProcess.sync())
            .then((SyncResult) => finalizationProcess.sync())
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

    ///////////////////////////////////////////////////////////////////////////////

    sync(): q.Promise<SyncResult> {
        let defer = q.defer<SyncResult>();

        Sync.findById(this.localSync._id, (err, serverSync: IServerSync) => {
            if (err) defer.reject(err);
            if (!serverSync) {
                // create server sync
                let sync = new Sync();
                sync._id = this.localSync._id;
                sync.dateCreated = Date.now();
                sync.dateModified = this.localSync.dateModified - 100;
                sync.animationIds = [];
                sync.save<IServerSync>((err, res) => {
                    if (err) defer.reject(err);
                    else if(!res) defer.reject('Unable to create server sync');
                    else this.executeSync(defer, res);
                })
            }
            else {
                this.executeSync(defer, serverSync);
            }
        });
        return defer.promise;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////

    protected log(msg: string) {
        winston.info("Sync: [" + this.name + "] " + msg);
    }

    protected abstract doSync(defer: q.Deferred<SyncResult>, localSync: ILocalSync, serverSync: IServerSync);

    //////////////////////////////////////////////////////////////////////////////////////////////

    private executeSync(defer: q.Deferred<SyncResult>, serverSync: IServerSync){
        let ids = _.map(serverSync.animationIds, (animationId) => new mongoose.Types.ObjectId(animationId));
        Animation.find({ _id: { $in: ids }}, { frames: 0 }).lean(true).exec((err, serverAnimations) => {
            if (err) defer.reject(err);
            else {
                serverSync.animations = serverAnimations;
                this.doSync(defer, this.localSync, serverSync);
            }
        });
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * This process is called before anything else.
 * This process should check all pre-reqs and to prevent errors later in the process.
 * 
 */
class Preparation extends SyncProcess {
    constructor(syncResult: SyncResult, localSync: ILocalSync) {
        super("Preparation", syncResult, localSync);
    }
    
    doSync(defer: q.Deferred<SyncResult>, localSync: ILocalSync, serverSync: IServerSync) {
        this.log("Preparation");

        return this.checkUser(localSync._id)
            .then(() => {
                defer.resolve(this.syncResult);
            })
            .catch((err) => {
                defer.reject(err);
            });
    }

    /**
     * User must exits!
     */
    private checkUser(userId: string): q.Promise<any> {
        this.log("Check user");
        let defer = q.defer();
        // make sure user exists
        User.findOne({ _id: userId, active: true }, (err, user) => {
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

/**
 * This process checks what has been created since last sync from both server and local
 */
class Addition extends SyncProcess {
    constructor(syncResult: SyncResult, localSync: ILocalSync) {
        super("Addition", syncResult, localSync);
    }
    
    doSync(defer: q.Deferred<SyncResult>, localSync: ILocalSync, serverSync: IServerSync) {
        this.log("Addition check");
          
        if (serverSync.dateModified > this.localSync.dateModified) {
            this.log("Server is more current");

            let addLocals = findDiff(serverSync.animations, localSync.animations);
            for (let i = 0; i < addLocals.length; i++) {
                let addLocal = addLocals[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientPull, addLocal._id, addLocal.localId));
            }

            let addRemotes = findDiff(localSync.animations, serverSync.animations);
            for (let i = 0; i < addRemotes.length; i++) {
                let addRemote = addRemotes[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientPush, addRemote._id, addRemote.localId));
            }

            defer.resolve(this.syncResult);
        }
        else if (this.localSync.dateModified > serverSync.dateModified) {
            this.log("Client is more current");

            let addRemotes = findDiff(localSync.animations, serverSync.animations);
            for (let i = 0; i < addRemotes.length; i++) {
                let addRemote = addRemotes[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientPush, addRemote._id, addRemote.localId));
            }

            let addLocals = findDiff(serverSync.animations, localSync.animations);
            for (let i = 0; i < addLocals.length; i++) {
                let addLocal = addLocals[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientPull, addLocal._id, addLocal.localId));
            }

            defer.resolve(this.syncResult);
        }
        else {
            this.log("Server and Client [UP TO DATE]");
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
            
            let deleteLocals = findDiff(localSync.animations, serverSync.animations);
            for (let i = 0; i < deleteLocals.length; i++) {
                let deleteLocal = deleteLocals[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ClientDelete, deleteLocal._id, deleteLocal.localId));
            }
            
            this.doServerDeletion(defer);
        }
        else if (this.localSync.dateModified > serverSync.dateModified) {
            this.log("Client is more current");
 
            let deleteRemotes = findDiff(serverSync.animations, localSync.animations);
            for (let i = 0; i < deleteRemotes.length; i++) {
                let deleteRemote = deleteRemotes[i];
                this.syncResult.addSyncEvent(new SyncEvent(SyncAction.ServerDelete, deleteRemote._id, deleteRemote.localId));
            }
            
            this.doServerDeletion(defer);
        }
        else {
            this.log("Server and Client [UP TO DATE]");
            defer.resolve(this.syncResult);
        }
    }

    private doServerDeletion(defer: q.Deferred<SyncResult>){
        let deleteServerIds = [];
        for (let i = 0; i < this.syncResult.events.length; i++) {
            if (this.syncResult.events[i].action == SyncAction.ServerDelete){
                deleteServerIds.push(this.syncResult.events[i].animationId.toString());
            }
        }

        if (deleteServerIds.length > 0){
            Animation.remove({ _id: { $in: deleteServerIds } }, (err) => {
                if (!err) defer.reject(err);
                else defer.resolve(this.syncResult);
            });
        }
        else
            defer.resolve(this.syncResult);
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
        serverSync.clientId = localSync.clientId;
        serverSync.save((err, res) => {
            if (err) defer.reject(err);
            else {
                defer.resolve(this.syncResult);
                this.log('ServerSync.clientId Updated');
            }
        });
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function findDiff(srcAnimations: Grafika.IAnimation[], targetAnimations: Grafika.IAnimation[]) : Grafika.IAnimation[]{
    let animations: Grafika.IAnimation[] = [];
    for (let i = 0; i < srcAnimations.length; i++) {
        let found = false;
        for (let j = 0; j < targetAnimations.length; j++){
            if (found = animEquals(srcAnimations[i], targetAnimations[j]))
                break;
        }

        if (!found)
            addAnimation(srcAnimations[i]);
    }

    function addAnimation(anim: Grafika.IAnimation){
        let found = false;
        for (let i = 0; i < animations.length; i++) {
            if (animations[i]._id == anim._id || animations[i].localId == anim.localId) {
                found = true;
                break;
            }
        }

        if (!found)
            animations.push(anim);
    }

    return animations;
}

function animEquals(anim: Grafika.IAnimation, other: Grafika.IAnimation){
    if (anim == undefined || other == undefined)
        return false;
    return (anim._id == other._id || anim.localId == other.localId);
}