"use strict";
var mongoose = require('mongoose');
exports.mongoose = mongoose;
var _model = require('./model'), handlers = require('./handlers');
exports.model = _model;
exports.handlers = handlers;
exports = module.exports = handlers;
exports.model = _model;
exports.mongoose = mongoose;
//# sourceMappingURL=restful.js.map