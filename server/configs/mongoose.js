"use strict";
var winston = require('winston');
var config = require('../configs/config');
var mongoose = require('mongoose');
function initialize(app) {
    winston.debug('Connecting to mongodb');
    mongoose.connect(config.setting.$server.$databaseUrl, function (err) {
        if (!err) {
            winston.info('mongodb [OK]');
        }
        else {
            winston.error('mongodb [FAILED]');
            winston.error(err);
        }
    });
}
exports.initialize = initialize;
//# sourceMappingURL=mongoose.js.map