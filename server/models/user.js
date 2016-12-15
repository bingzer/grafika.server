"use strict";
var mongoose = require('mongoose');
var winston = require('winston');
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
        avatar: { type: String, default: defaultAvatar },
        backdrop: { type: String, default: randomlyPickBackdrop },
        drawingIsPublic: { type: Boolean, default: false },
        drawingAuthor: { type: String },
        drawingTimer: { type: Number, default: 1000 },
        playbackLoop: { type: Boolean, default: false }
    },
    stats: {
        dateLastSeen: { type: Number }
    },
    subscriptions: {
        emailAnimationComment: { type: Boolean, default: true },
        emailAnimationRating: { type: Boolean, default: true }
    }
});
// methods ======================
// generating a hash
exports.UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// generate random active hash
exports.UserSchema.methods.generateActivationHash = function () {
    return exports.UserSchema.methods.generateHash(crypto.lib.WordArray.random(128 / 8));
};
// checking if password is valid
exports.UserSchema.methods.validPassword = function (password) {
    if (!password || !this.local.password)
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
var User = restful.model('users', exports.UserSchema);
exports.User = User;
User.ensureIndexes(function (err) {
    if (err)
        winston.error(err);
    else {
        winston.info('UserTextIndex [OK]');
        ensureAdminExists()
            .then(function () { return winston.info('Admin Accounts [OK]'); })
            .catch(function (err) { return winston.error('Admin Accounts [ERROR]', err); });
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateLastSeen(userOrUserId) {
    var userId = userOrUserId._id || userOrUserId;
    User.update({ _id: new mongoose.Types.ObjectId(userId) }, { "stats.dateLastSeen": Date.now() }).exec();
}
exports.updateLastSeen = updateLastSeen;
function generateJwtToken(user) {
    return jwt.sign(sanitize(user), SECRET, {
        expiresIn: '24h' // expires in 24 hours
    });
}
exports.generateJwtToken = generateJwtToken;
/**
 * Verify JWT Token.
 * This will not check if the token is expired
 */
function verifyJwtToken(token, callback) {
    jwt.verify(token, SECRET, { ignoreExpiration: true }, callback);
}
exports.verifyJwtToken = verifyJwtToken;
function generateDisqusToken(user) {
    var disqusData = {
        id: user._id,
        username: user.username,
        // email: user.email, 
        avatar: user.prefs.avatar,
        url: 'https://grafika.bingzer.com/users/' + user._id // never change https://grafika.bingzer.com
    };
    var disqusStr = JSON.stringify(disqusData);
    var timestamp = Math.round(+new Date() / 1000);
    /*
     * Note that `Buffer` is part of node.js
     * For pure Javascript or client-side methods of
     * converting to base64, refer to this link:
     * http://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript
     */
    var message = new Buffer(disqusStr).toString('base64');
    /*
     * CryptoJS is required for hashing (included in dir)
     * https://code.google.com/p/crypto-js/
     */
    var result = crypto.HmacSHA1(message + " " + timestamp, config.setting.$auth.$disqusSecret);
    var hexsig = crypto.enc.Hex.stringify(result);
    return {
        public: config.setting.$auth.$disqusId,
        token: message + " " + hexsig + " " + timestamp
    };
}
exports.generateDisqusToken = generateDisqusToken;
function sanitize(user) {
    var lean = user;
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
    if (user.stats) {
        delete user.stats;
    }
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
    return 'user-' + (("0000000" + (Math.random() * Math.pow(36, 7) << 0).toString(36)).slice(-7));
}
exports.randomUsername = randomUsername;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function randomlyPickBackdrop() {
    var prefix = config.setting.$content.$url + 'assets/img/backdrops/';
    var backdrop = utils_1.randomlyPick(['001.png', '002.png', '003.png', '004.png', '005.png']); // todo: use file.list()
    return prefix + backdrop;
}
function defaultAvatar() {
    return config.setting.$content.$url + 'assets/img/ic_user.png';
}
//# sourceMappingURL=user.js.map