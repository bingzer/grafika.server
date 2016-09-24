import * as mongoose from 'mongoose';
import * as winston from 'winston';

import restful = require('../libs/restful');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IAnimation extends Grafika.IAnimation, mongoose.Document {
    removed      : boolean;
}

export const AnimationSchema = new mongoose.Schema({
    localId      : { type: String },

    type         : { type: String, required: true, default: 'animation' },
    name         : { type: String, required: true },
    description  : String,

    timer        : Number,
    width        : { type: Number, required: true },
    height       : { type: Number, required: true },

    dateCreated  : { type: Number, required: true },
    dateModified : { type: Number, required: true },

    views        : { type: Number, default: 0 },
    rating       : { type: Number, default: 2.5 },
    category     : String,
    removed      : { type: Boolean, required: true, default: false },

    isPublic     : { type: Boolean, default: false },
    author       : String,
    userId       : { type: String, required: true },

    totalFrame   : { type: Number, default: 0 },
    frames       : { type: [], select: false }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let Animation = <restful.IModel<IAnimation>> restful.model('animations', AnimationSchema);
Animation.methods(['get', 'put', 'post']);
Animation.before('post', (req, res, next) => {
    // check for date time
    let now = Date.now();
    if (!req.body.dateCreated) req.body.dateCreated = now;
    if (!req.body.dateModified) req.body.dateModified = now;
    if (!req.body.userId) req.body.userId = req.user._id;
    if (!req.body.author) req.body.author = req.user.prefs.drawingAuthor || req.user.username;
    req.body.totalFrame = req.body.frames ? req.body.frames.length : 0;

    delete req.body._id;
    
    next();
});
Animation.before('get', (req, res, next) => {
    if (req.query && typeof(req.query.removed) === 'undefined')
        req.query.removed = false;
    next();
});
Animation.before('put', (req, res, next) => {
    req.body.totalFrame = req.body.frames ? req.body.frames.length : 0;
    delete req.body.frames;
    next();
});
// -- Frames
Animation.route('frames', {
    detail: true,
    handler: (req, res, next) => {
        if (req.method === 'GET') {
            Animation.db.collections.animations.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, { frames: 1}, (err, result) =>{
                if (err) return next(err);
                if (!result) return next(400);
                res.send(result.frames);
            });
        }
        else if (req.method == 'POST') {
            Animation.db.collections.animations.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.params.id) }, { $set: { 'frames': req.body} }, (err) => {
                if (err) return next(err);
                res.sendStatus(201);
            });
        }
        else next(400);
    }
});
// -- Resources
Animation.route('resources', {
    detail: true,
    handler: (req, res, next) => {
        next();
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

AnimationSchema.index({ name: "text", description: "text", author: "text" }, { name: 'AnimationTextIndex', weights: { name: 10, description: 4, author: 2 } });
Animation.ensureIndexes((err) => {
    if (err) 
        winston.error(err);
    else winston.info('   AnimationTextIndex [OK]');
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export { Animation };