import * as mongoose from 'mongoose';
var _model = require('./model'),
    handlers = require('./handlers');

exports = module.exports = handlers;
exports.model = _model;
exports.mongoose = mongoose;

export { handlers };
export { _model as model };
export { mongoose };

export interface IModel<T extends mongoose.Document> extends mongoose.Model<T> {
    methods([string]);
    register(app: any, path: string);
    
    route(method: string, handler: any);

    after(method: string, next: (req, res, next) => void);
    before(method: string, next: (req, res, next) => void);
}