"use strict";
var mongoose = require("mongoose");
var winston = require("winston");
var aws_1 = require("../libs/aws");
var restful = require("../libs/restful");
exports.AnimationSchema = new mongoose.Schema({
    localId: { type: String },
    type: { type: String, required: true, default: 'animation' },
    name: { type: String, required: true },
    description: String,
    timer: Number,
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    dateCreated: { type: Number, required: true },
    dateModified: { type: Number, required: true },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 2.5 },
    category: String,
    removed: { type: Boolean, required: true, default: false },
    isPublic: { type: Boolean, default: false },
    author: String,
    userId: { type: String, required: true },
    totalFrame: { type: Number, default: 0 },
    // frames       : { type: {}, select: false }
    client: {
        type: {
            name: { type: String, default: "generic" },
            version: { type: String, default: "unknown" },
            browser: { type: String, default: "unknown" }
        }
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Animation = restful.model('animations', exports.AnimationSchema);
exports.Animation = Animation;
Animation.methods(['get', 'put', 'post']);
Animation.before('post', function (req, res, next) {
    // no id allowed!
    delete req.body._id;
    // check for date time
    var now = Date.now();
    if (!req.body.dateCreated)
        req.body.dateCreated = now;
    if (!req.body.dateModified)
        req.body.dateModified = now;
    if (!req.body.userId)
        req.body.userId = req.user._id;
    if (!req.body.author)
        req.body.author = req.user.prefs.drawingAuthor || req.user.username;
    if (!req.body.totalFrame)
        req.body.totalFrame = 0;
    next();
});
Animation.before('get', function (req, res, next) {
    if (req.query) {
        if (typeof (req.query.removed) == 'undefined')
            req.query.removed = false;
    }
    next();
});
Animation.before('put', function (req, res, next) {
    req.body.totalFrame = req.body.frames ? req.body.frames.length : req.body.totalFrame;
    delete req.body.frames;
    next();
});
// -- Frames
Animation.route('frames', {
    detail: true,
    handler: function (req, res, next) {
        if (req.method == 'POST') {
            var animationId = req.params.id;
            // update total frames
            Animation.findByIdAndUpdate(animationId, { totalFrame: req.body.length });
            var awsFrames = new aws_1.AwsFrames();
            awsFrames.postFrames(animationId, req, res, next);
        }
        else if (req.method === 'GET') {
            var animationId_1 = req.params.id;
            Animation.db.collections.animations.findOne({ _id: new mongoose.Types.ObjectId(animationId_1) }, { frames: 1 }, function (err, result) {
                if (err)
                    return next(err);
                var awsFrames = new aws_1.AwsFrames();
                awsFrames.getFrames(animationId_1, req, res, next);
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
        else
            next(400);
    }
});
// -- Resources
Animation.route('resources', {
    detail: true,
    handler: function (req, res, next) {
        next();
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.AnimationSchema.index({ name: "text", description: "text", author: "text" }, { name: 'AnimationTextIndex', weights: { name: 10, description: 4, author: 2 } });
Animation.ensureIndexes(function (err) {
    if (err)
        winston.error(err);
    else
        winston.info('AnimationTextIndex [OK]');
});
//# sourceMappingURL=animation.js.map