"use strict";
var winston = require('winston');
var mongoose = require('mongoose');
var q = require('q');
var config = require('../configs/config');
function initialize(app) {
    var defer = q.defer();
    winston.debug('Connecting to mongodb');
    var mongooseInstance = mongoose.connect(config.setting.$server.$databaseUrl, function (err) {
        if (err) {
            winston.error('mongodb [FAILED]');
            defer.reject(err);
        }
        else {
            winston.info('mongodb [OK]');
            defer.resolve();
        }
    });
    mongooseInstance.Promise = q.Promise;
    return defer.promise;
}
exports.initialize = initialize;
//# sourceMappingURL=mongoose.js.map