import * as mongoose from 'mongoose';
import { Animation } from './animation';
import * as q from 'q';
import restful = require('../libs/restful');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ISync {
    userId       : string;
    animations   : Grafika.IAnimation[];
    tombstones   : Grafika.IAnimation[];
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Entity we get from the client
 */
export interface ILocalSync extends ISync {
    clientId           : string;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Server sync
 */
export interface IServerSync extends ISync {
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ServerSync implements IServerSync {
    animations   : Grafika.IAnimation[];
    tombstones   : Grafika.IAnimation[];

    constructor(public userId: string) {
        // nothing
    }

    public static find(userId: string) : q.Promise<ServerSync> {
        let defer = q.defer<ServerSync>();
        let serverSync = new ServerSync(userId);

        function findAnimations(query: any) : q.Promise<Grafika.IAnimation[]> {
            let defer = q.defer<Grafika.IAnimation[]>();
            Animation.find(query, { frames: 0 }).lean().exec((err, results) => {
                if (err) defer.reject(err);
                else if (!results) defer.reject('not found');
                else {
                    defer.resolve(results);
                }
            });
            return defer.promise;
        }

        findAnimations({ userId: userId, removed: false })
            .then((results) => {
                serverSync.animations = results;
                return findAnimations({ userId: userId, removed: true });
            })
            .then((results) => {
                serverSync.tombstones = results;
                defer.resolve(serverSync);
            })
            .catch((error) => defer.reject(error));

        return defer.promise;
    }
}