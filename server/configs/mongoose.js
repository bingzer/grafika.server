"use strict";
var winston = require('winston');
var mongoose = require('mongoose');
var q = require('q');
var config = require('../configs/config');
function initialize() {
    winston.debug('Connecting to MongoDB');
    var connOption = {
        server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
    };
    var instance = mongoose.connect(config.setting.$server.$databaseUrl, connOption, function (err) {
        if (!err) {
            winston.info('MongoDB [OK]');
            winston.info('   Version: ' + instance.version);
        }
        else
            winston.error('MongoDB [ERROR]', err);
    });
    instance.Promise = q.Promise;
}
exports.initialize = initialize;
//# sourceMappingURL=mongoose.js.map