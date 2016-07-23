import * as mongoose from 'mongoose';
import restful = require('../libs/restful');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ISync extends mongoose.Document {
    _id: string | any,
    animationIds: string[],
    dateModified: number,
    dateCreated: number
}

export interface IServerSync extends ISync {

}

export interface ILocalSync extends ISync {
    animations: Grafika.IAnimation[]
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SyncSchema = new mongoose.Schema({
    _id               : { type: String, required: true },
    animationIds      : { type: [String] },
    dateModified      : Number,
    dateCreated       : Number
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var Sync = <restful.IModel<ISync>> restful.model('sync', SyncSchema);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createOrUpdateSync(userId: string, animationId: string, callback?: (err: any, res: ISync) => void) {
    Sync.findById(userId, (err, serverSync) => {
        if (!serverSync) {
            let sync = { _id: new mongoose.Types.ObjectId(userId.toString()), animationIds: [ animationId ], dateModified: Date.now(), dateCreated: Date.now() };
            Sync.create(sync, (err, res) => callback(err, res));
        }
        else {
            if (!err) {
                // update
                let found = false;
                for (let i = 0; i < serverSync.animationIds.length; i++) {
                    if (serverSync.animationIds[i] == animationId) {
                        found = true;
                        break;
                    }
                }
                if (!found)
                    serverSync.animationIds.push(animationId);
                serverSync.dateModified = Date.now();
                serverSync.save();
            }
            callback(err, serverSync);
        }
    });
}

function deleteSync(userId: string, animationId: string, callback?: (err: any) => void) {
    Sync.findById(userId, (err, sync) => {
        let i = 0;
        for(; i < sync.animationIds.length; i++) {
            if (sync.animationIds[i] == animationId) {
                break;
            }
        }

        sync.animationIds.splice(i, 1);
        sync.dateModified = Date.now();
        sync.save();
        callback(err);
    });
}

export { Sync, createOrUpdateSync, deleteSync };