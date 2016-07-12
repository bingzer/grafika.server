import * as mongoose from 'mongoose';
var _model = require('./model'),
    handlers = require('./handlers');

// exports = module.exports = handlers;
// exports.model = _model;
// exports.mongoose = mongoose;

export { handlers };
export { _model as model };
export { mongoose };