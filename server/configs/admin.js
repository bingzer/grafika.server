"use strict";
var winston = require('winston');
var q = require('q');
var user_1 = require('../models/user');
function initialize(app) {
    return user_1.ensureAdminExists().then(function () {
        winston.info('Admin [OK]');
        return q.when(true);
    });
}
exports.initialize = initialize;
//# sourceMappingURL=admin.js.map