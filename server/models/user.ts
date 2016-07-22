import * as mongoose from 'mongoose';
import restful = require('../libs/restful');

import $q         = require('q');
var bcrypt        = require('bcrypt-nodejs');
var crypto        = require('crypto-js');

export interface IUser extends mongoose.Document, Grafika.IUser {
    prefs: IPreference;
    activation: IActivation;

    local: ILocal;
    facebook: IFacebook;
    google: IGoogle;
    animations: [String]

    generateHash(password: string): string;
    generateActivationHash(): string;
    validPassword(password: string): boolean;
    validActivationHash(activationHash : string): boolean;
    validActivationTimestamp(): boolean;
    sanitize(): IUser;
}

export interface IActivation {
    hash: string;
    timestamp: Date;
}

export interface IPreference {
    avatar: string;
    backdrop: string;
    drawingIsPublic: boolean,
    drawingAuthor: string;
    drawingTimer: number;
    playbackLoop: boolean;   
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
        avatar          : String,
        backdrop        : String,
        drawingIsPublic : { type: Boolean, default: false },
        drawingAuthor   : String,
        drawingTimer    : { type: Number, default: 1000 },
        playbackLoop    : { type: Boolean, default: false }
    },
    animations          : { type: [String], required: true }
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
    if (!this.local.password) return false;
    return bcrypt.compareSync(password, this.local.password);
};
UserSchema.methods.validActivationHash = function(activationHash: string) : boolean{
    return this.activation.hash === activationHash;
};
UserSchema.methods.validActivationTimestamp = function(): boolean{
    var expiredTime = 5 * 60 * 1000;
    if (this.activation.timestamp && Math.abs(Date.now() - this.activation.timestamp) < expiredTime)
        return true;
    return false;
};
UserSchema.methods.sanitize = function(): IUser {
    return sanitize(this);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var User = <restful.IModel<IUser>> restful.model('users', UserSchema);
User.methods(['get', 'put']);

export function sanitize(user: IUser | any) : any | IUser {
    var lean = user;
    if (user.toObject) {
        user = user.toObject();
    }
    delete user.local;
    delete user.facebook;
    delete user.google;
    delete user.activation;
    return user;
}

export function checkAvailability(user : IUser | any) : $q.IPromise<{}> {
    var deferred = $q.defer();
    var query = {
        username: user.username,
        email: { $ne: user.email }
    };
    User.findOne(query, (err, user) => {
        if (err || user) deferred.reject('failed');
        else deferred.resolve();
    });
    return deferred.promise;
}

export function userQuery(username: string) : any {
    var name = username ? username.toLowerCase() : null;
    return { $or:[{ 'email': name }, { 'username': name }] };
}

export function ensureAdminExists() : void {
	User.findOne(userQuery('admin'), (err, user) => {
		if (!user) {
			// TODO: flag this use as an admin
			var admin = new User();
			admin.firstName        = 'grafika';
			admin.lastName         = 'admin';
			admin.email            = 'grafika@bingzer.com';
			admin.dateCreated      = Date.now();
			admin.dateModified     = Date.now();
			admin.active           = true;
			admin.local.registered = true;
			admin.local.password   = admin.generateHash('password');
            admin.roles.push('administrator');
			admin.save();
		}
	});
};

export function randomUsername(){
    return 'user-' + (("000000" + (Math.random()*Math.pow(36,6) << 0).toString(36)).slice(-6));
}

export { User };