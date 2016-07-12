"use strict";
var winston = require('winston');
var config = require('../configs/config');
var restful = require('../libs/restful');
function initialize() {
    winston.debug('Connecting to mongodb');
    restful.mongoose.connect(config.setting.$server.$databaseUrl, function (err) {
        if (!err)
            winston.info('mongodb [OK]');
        else {
            winston.error('mongodb [FAILED]');
            winston.error(err);
        }
    });
}
exports.initialize = initialize;
//# sourceMappingURL=mongoose.js.map