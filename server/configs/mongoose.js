"use strict";
var winston = require('winston');
var mongoose = require('mongoose');
var q = require('q');
var config = require('../configs/config');
function initialize(app) {
    var defer = q.defer();
    winston.debug('Connecting to MongoDB');
    var connOption = {
        server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
    };
    var instance = mongoose.connect(config.setting.$server.$databaseUrl, connOption, function (err) {
        if (err) {
            winston.error('MongoDB [FAILED]');
            defer.reject(err);
        }
    });
    instance.Promise = q.Promise;
    instance.connection.on('open', function (err) {
        if (!err) {
            winston.info('MongoDB [OK]');
            winston.info('   Version: ' + instance.version);
            defer.resolve();
        }
        else {
            defer.reject(err);
        }
    });
    instance.connection.on('error', function (err) {
        winston.error('[Mongoose]', err);
    });
    return defer.promise;
}
exports.initialize = initialize;
//# sourceMappingURL=mongoose.js.map