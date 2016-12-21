import * as mongoose from 'mongoose';
import * as express from 'express';
import * as winston from 'winston';
import * as zlib from 'zlib';
import { AwsFrames } from '../libs/aws'

import restful = require('../libs/restful');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IAnimation extends Grafika.IAnimation, mongoose.Document {
    removed      : boolean;
}

export const AnimationSchema = new mongoose.Schema({
    localId         : { type: String },

    type            : { type: String, required: true, default: 'animation' },
    name            : { type: String, required: true },
    description     : String,

    timer           : Number,
    width           : { type: Number, required: true },
    height          : { type: Number, required: true },

    dateCreated     : { type: Number, required: true },
    dateModified    : { type: Number, required: true },

    views           : { type: Number, default: 0 },
    rating          : { type: Number, default: 2.5 },
    category        : String,
    removed         : { type: Boolean, required: true, default: false },

    isPublic        : { type: Boolean, default: false },
    author          : String,
    userId          : { type: String, required: true },

    totalFrame      : { type: Number, default: 0 },
    resources       : [{
        id          : { type: String, required: true },
        type        : { type: String, required: true },
        url         : String,
        mime        : String
    }],
    // frames       : { type: {}, select: false }

    client          : {
        name        : { type: String, default: "generic" },
        version     : { type: String, default: "unknown" },
        browser     : { type: String, default: "unknown" }
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let Animation = <restful.IModel<IAnimation>> restful.model('animations', AnimationSchema);
Animation.methods(['get', 'put', 'post']);
Animation.before('post', (req, res, next) => {
    // no id allowed!
    delete req.body._id;
    // check for date time
    let now = Date.now();
    if (!req.body.dateCreated) req.body.dateCreated = now;
    if (!req.body.dateModified) req.body.dateModified = now;
    if (!req.body.userId) req.body.userId = req.user._id;
    if (!req.body.author) req.body.author = req.user.prefs.drawingAuthor || req.user.username;
    if (!req.body.totalFrame) req.body.totalFrame = 0;

    next();
});
Animation.before('get', (req, res, next) => {
    if (req.query) {
        if (typeof(req.query.removed) === 'undefined')
            req.query.removed = false;
        // do this default selection only when ID is not specified
        if (typeof(req.query._id) === 'undefined') {
            if (typeof(req.query.type) === 'undefined') req.query.type = 'animation';
            if (typeof(req.query.totalFrame === 'undefined')) req.query.totalFrame = { $gt: 0 };
        }
    }

    next();
});
Animation.before('put', (req, res, next) => {
    req.body.totalFrame = req.body.frames ? req.body.frames.length : req.body.totalFrame;
    delete req.body.frames;
    next();
});

// -- Frames
Animation.route('frames', {
    detail: true,
    handler: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.method == 'POST') {
            let animationId = <string> req.params.id;
            // update total frames
            if (req.header("Content-Encoding") !== "deflate")
                Animation.findByIdAndUpdate(animationId, { totalFrame: req.body.length });

            let awsFrames = new AwsFrames();
            awsFrames.postFrames(animationId, req, res, next);
            // zlib.deflate(Buffer.from(req.body), (err, result: Buffer) => {
            //     if (err) return next(err);
            //     Animation.findOneAndUpdate({ _id: req.params.id }, { $set: { 'frames': result.toString('base64') } }).lean()
            //         .exec((err, result) => {
            //             if (err) next(err);
            //             else res.sendStatus(201);
            //         });
            // });


        }
        else if (req.method === 'GET') {
            let animationId = <string> req.params.id;
            Animation.db.collections.animations.findOne({ _id: new mongoose.Types.ObjectId(animationId) }, { frames: 1 }, (err, result) =>{
                if (err) return next(err);
                
                let awsFrames = new AwsFrames();
                awsFrames.getFrames(animationId, req, res, next);

                // res.header('Content-Type', 'application/json');
                // if (!result.frames) {
                //     res.send();
                // }
                // else if (req.acceptsEncodings('deflate')) {
                //     res.writeHead(200, {'Content-Encoding': 'deflate'})
                //     res.end(Buffer.from(result.frames, "base64"));
                // }
                // else {
                //     zlib.inflate(Buffer.from(result.frames, "base64"), (err, result) => {
                //         if (err) next(err);
                //         else res.send(result.toString());
                //     });
                // }
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
    else winston.info('AnimationTextIndex [OK]');
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export { Animation };