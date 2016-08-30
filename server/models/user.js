"use strict";
var mongoose = require('mongoose');
var winston = require('winston');
var fs = require('fs');
var q = require('q');
var config = require('../configs/config');
var restful = require('../libs/restful');
var utils_1 = require('../libs/utils');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');
var SECRET = config.setting.$server.$superSecret;
var GRAFIKA_ADMIN = 'grafika@bingzer.com';
exports.UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: { type: String, lowercase: true, trim: true, required: true, default: randomUsername() },
    email: { type: String, lowercase: true, trim: true, required: true },
    dateCreated: { type: Number, required: true },
    dateModified: { type: Number, required: true },
    active: { type: Boolean, default: false },
    roles: { type: [String], default: ['user'] },
    local: {
        password: String,
        registered: Boolean
    },
    facebook: {
        id: String,
        token: String,
        displayName: String
    },
    google: {
        id: String,
        token: String,
        displayName: String
    },
    activation: {
        hash: String,
        timestamp: Date
    },
    prefs: {
        avatar: { type: String, default: '/assets/img/ic_user.png' },
        backdrop: { type: String, default: randomlyPickBackdrop },
        drawingIsPublic: { type: Boolean, default: false },
        drawingAuthor: { type: String },
        drawingTimer: { type: Number, default: 1000 },
        playbackLoop: { type: Boolean, default: false }
    }
});
exports.UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
exports.UserSchema.methods.generateActivationHash = function () {
    return exports.UserSchema.methods.generateHash(crypto.lib.WordArray.random(128 / 8));
};
exports.UserSchema.methods.validPassword = function (password) {
    if (!this.local.password)
        return false;
    return bcrypt.compareSync(password, this.local.password);
};
exports.UserSchema.methods.validActivationHash = function (activationHash) {
    return this.activation.hash === activationHash;
};
exports.UserSchema.methods.validActivationTimestamp = function () {
    var expiredTime = 5 * 60 * 1000;
    if (this.activation.timestamp && Math.abs(Date.now() - this.activation.timestamp) < expiredTime)
        return true;
    return false;
};
exports.UserSchema.methods.sanitize = function () {
    return sanitize(this);
};
exports.UserSchema.methods.isAdministrator = function () {
    return isAdministrator(this);
};
exports.UserSchema.index({ email: 'text', firstName: 'text', lastName: 'text', username: 'text' }, {
    name: 'UserTextIndex',
    weights: { email: 10, lastName: 6, firstName: 4, username: 2 }
});
var User = restful.model('users', exports.UserSchema);
exports.User = User;
User.ensureIndexes(function (err) {
    if (err)
        winston.error(err);
    else
        winston.info('   UserTextIndex [OK]');
});
function generateJwtToken(user) {
    return jwt.sign(sanitize(user), SECRET, {
        expiresIn: '24hr'
    });
}
exports.generateJwtToken = generateJwtToken;
function sanitize(user) {
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
exports.sanitize = sanitize;
function checkAvailability(user) {
    var deferred = q.defer();
    var query = {
        username: user.username,
        email: { $ne: user.email }
    };
    User.findOne(query, function (err, user) {
        if (err || user)
            deferred.reject('failed');
        else
            deferred.resolve();
    });
    return deferred.promise;
}
exports.checkAvailability = checkAvailability;
function isAdministrator(user) {
    return user && user.roles && user.roles.indexOf('administrator') > -1;
}
exports.isAdministrator = isAdministrator;
function userQuery(username) {
    var name = username ? username.toLowerCase() : null;
    return { $or: [{ 'email': name }, { 'username': name }] };
}
exports.userQuery = userQuery;
function ensureAdminExists() {
    var defer = q.defer();
    User.findOne(userQuery(GRAFIKA_ADMIN), function (err, user) {
        if (err)
            return defer.reject(err);
        if (!user) {
            user = new User();
            user.firstName = 'grafika';
            user.lastName = 'admin';
            user.username = 'grafika';
            user.email = GRAFIKA_ADMIN;
            user.dateCreated = Date.now();
            user.dateModified = Date.now();
            user.active = true;
            user.local.registered = true;
            user.local.password = user.generateHash('password');
            user.roles.push('administrator');
            user.save();
        }
        defer.resolve(user);
    });
    return defer.promise;
}
exports.ensureAdminExists = ensureAdminExists;
;
function randomUsername() {
    return 'user-' + (("000000" + (Math.random() * Math.pow(36, 6) << 0).toString(36)).slice(-6));
}
exports.randomUsername = randomUsername;
function randomlyPickBackdrop() {
    var prefix = '/assets/img/backdrops/';
    var backdropFiles = fs.readdirSync('client/assets/img/backdrops');
    var backdrop = utils_1.randomlyPick(backdropFiles);
    return prefix + backdrop;
}
//# sourceMappingURL=user.js.map