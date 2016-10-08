import * as mongoose from 'mongoose';
import * as winston from 'winston';
import * as fs from 'fs';
import * as q from 'q';
import * as config from '../configs/config';

import restful = require('../libs/restful');
import { randomlyPick } from '../libs/utils';

const bcrypt        = require('bcrypt-nodejs');
const crypto        = require('crypto-js');
const jwt           = require('jsonwebtoken');
const SECRET        = config.setting.$server.$superSecret;
const GRAFIKA_ADMIN = 'grafika@bingzer.com'; 


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IUser extends mongoose.Document, Grafika.IUser {
    activation: IActivation;

    local: ILocal;
    facebook: IFacebook;
    google: IGoogle;

    generateHash(password: string): string;
    generateActivationHash(): string;
    validPassword(password: string): boolean;
    validActivationHash(activationHash : string): boolean;
    validActivationTimestamp(): boolean;
    sanitize(): IUser;
    isAdministrator(): boolean;
}

export interface IActivation {
    hash: string;
    timestamp: Date;
}

export interface IAccount {
    id: string;
}

export interface ILocal extends IAccount {
    password: string,
    registered: boolean;
}

export interface IFacebook extends IAccount {
    token: string;
    displayName: string;
}

export interface IGoogle extends IAccount {
    token: string;
    displayName: string;
}

export const UserSchema = new mongoose.Schema({
    firstName           : String,
    lastName            : String,
    username            : { type: String, lowercase: true, trim: true, required: true, default: randomUsername() },
    email               : { type: String, lowercase: true, trim: true, required: true },
    dateCreated         : { type: Number, required: true },
    dateModified        : { type: Number, required: true },
    active              : { type: Boolean, default: false },
    roles               : { type: [String], default: ['user'] },
    local               : {
        password        : String,
        registered      : Boolean
    },
    facebook            : {
        id              : String,
        token           : String,
        displayName     : String
    },
    google              : {
        id              : String,
        token           : String,
        displayName     : String
    },
    activation          : {
        hash            : String,
        timestamp       : Date
    },
    prefs               : {
        avatar          : { type: String, default: '/assets/img/ic_user.png' },
        backdrop        : { type: String, default: randomlyPickBackdrop },
        drawingIsPublic : { type: Boolean, default: false },
        drawingAuthor   : { type: String },
        drawingTimer    : { type: Number, default: 1000 },
        playbackLoop    : { type: Boolean, default: false }
    }
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) : string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// generate random active hash
UserSchema.methods.generateActivationHash = function() : string{
    return UserSchema.methods.generateHash(crypto.lib.WordArray.random(128/8))
}
// checking if password is valid
UserSchema.methods.validPassword = function(password: string) : boolean {
    if (!password || !this.local.password) return false;
    return bcrypt.compareSync(password, this.local.password);
};
UserSchema.methods.validActivationHash = function(activationHash: string) : boolean{
    return this.activation.hash === activationHash;
};
UserSchema.methods.validActivationTimestamp = function(): boolean{
    let expiredTime = 5 * 60 * 1000;
    if (this.activation.timestamp && Math.abs(Date.now() - this.activation.timestamp) < expiredTime)
        return true;
    return false;
};
UserSchema.methods.sanitize = function(): IUser {
    return sanitize(this);
};
UserSchema.methods.isAdministrator = function(): boolean {
    return isAdministrator(this);
};
UserSchema.index(
    { email: 'text', firstName: 'text', lastName: 'text', username: 'text' }, 
    { 
        name: 'UserTextIndex', 
        weights: { email: 10, lastName: 6, firstName: 4, username: 2 } 
    }
);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////

let User = <restful.IModel<IUser>> restful.model('users', UserSchema);

User.ensureIndexes((err) => {
    if (err)
        winston.error(err);
    else winston.info('   UserTextIndex [OK]');
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function generateJwtToken(user: IUser | any) : string {
    return jwt.sign(sanitize(user), SECRET, {
        expiresIn: '24h' // expires in 24 hours
    });
}

/**
 * Verify JWT Token.
 * This will not check if the token is expired
 */
export function verifyJwtToken(token: string, callback: (err, user) => void) {
    jwt.verify(token, SECRET, { ignoreExpiration: true }, callback);
}

export function generateDisqusToken(user: IUser) {
    let disqusData = {
        id: user._id,
        username: user.username,
        // email: user.email, 
        avatar: user.prefs.avatar,
        url: 'http://grafika.bingzer.com/users/' + user._id
    };

    let disqusStr = JSON.stringify(disqusData);
    let timestamp = Math.round(+new Date() / 1000);

    /*
     * Note that `Buffer` is part of node.js
     * For pure Javascript or client-side methods of
     * converting to base64, refer to this link:
     * http://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript
     */
    let message = new Buffer(disqusStr).toString('base64');

    /* 
     * CryptoJS is required for hashing (included in dir)
     * https://code.google.com/p/crypto-js/
     */
    let result = crypto.HmacSHA1(message + " " + timestamp, config.setting.$auth.$disqusSecret);
    let hexsig = crypto.enc.Hex.stringify(result);

    return {
      public: config.setting.$auth.$disqusId,
      token: message + " " + hexsig + " " + timestamp
    };
}

export function sanitize(user: IUser | any) : any | IUser {
    let lean = user;
    if (user.toObject) {
        user = user.toObject();
    }
    if (user.local) {
        delete user.local.password;
    }
    if (user.google) {
        delete user.google.id;
        delete user.google.token;
    }
    if (user.facebook) {
        delete user.facebook.id;
        delete user.facebook.token;
    }
    delete user.activation;
    
    return user;
}

export function checkAvailability(user : IUser | any) : q.Promise<{}> {
    let deferred = q.defer();
    let query = {
        username: user.username,
        email: { $ne: user.email }
    };
    User.findOne(query, (err, user) => {
        if (err || user) deferred.reject('failed');
        else deferred.resolve();
    });
    return deferred.promise;
}

export function isAdministrator(user: IUser | any): boolean {
    return user && user.roles && user.roles.indexOf('administrator') > -1;
}

export function userQuery(username: string) : any {
    let name = username ? username.toLowerCase() : null;
    return { $or:[{ 'email': name }, { 'username': name }] };
}

export function ensureAdminExists() : ng.IPromise<IUser> {
    let defer = q.defer<IUser>();

	User.findOne(userQuery(GRAFIKA_ADMIN), (err, user) => {
        if (err) return defer.reject(err);
        if (!user) {
			user = new User();
			user.firstName        = 'grafika';
			user.lastName         = 'admin';
            user.username         = 'grafika';
			user.email            = GRAFIKA_ADMIN;
			user.dateCreated      = Date.now();
			user.dateModified     = Date.now();
			user.active           = true;
			user.local.registered = true;
			user.local.password   = user.generateHash('password');
            user.roles.push('administrator');
			user.save();
		}
        defer.resolve(user);
	});

    return defer.promise;
};

export function randomUsername(){
    return 'user-' + (("0000000" + (Math.random()*Math.pow(36,7) << 0).toString(36)).slice(-7));
}

export { User };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function randomlyPickBackdrop(){
    const prefix = '/assets/img/backdrops/';
    let backdropFiles = fs.readdirSync('client/assets/img/backdrops');
    let backdrop = randomlyPick(backdropFiles); // todo: use file.list()
    return prefix + backdrop;
}