"use strict";
var mongoose = require('mongoose');
var winston = require('winston');
var zlib = require('zlib');
var restful = require('../libs/restful');
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
    frames: { type: {}, select: false }
});
var Animation = restful.model('animations', exports.AnimationSchema);
exports.Animation = Animation;
Animation.methods(['get', 'put', 'post']);
Animation.before('post', function (req, res, next) {
    delete req.body._id;
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
Animation.route('frames', {
    detail: true,
    handler: function (req, res, next) {
        if (req.method == 'POST') {
            Animation.findByIdAndUpdate(req.params.id, { totalFrame: req.body.length });
            var buffer = Buffer.from(req.body);
            zlib.deflate(Buffer.from(req.body), function (err, result) {
                if (err)
                    return next(err);
                Animation.findOneAndUpdate({ _id: req.params.id }, { $set: { 'frames': result } }).lean()
                    .exec(function (err, result) {
                    if (err)
                        next(err);
                    else
                        res.sendStatus(201);
                });
            });
        }
        else if (req.method === 'GET') {
            Animation.db.collections.animations.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, { frames: 1 }, function (err, result) {
                if (err)
                    return next(err);
                res.header('Content-Type', 'application/json');
                if (!result.frames) {
                    res.send();
                }
                else if (req.acceptsEncodings('deflate')) {
                    res.writeHead(200, { 'Content-Encoding': 'deflate' });
                    res.end(Buffer.from(result.frames, "base64"));
                }
                else {
                    zlib.inflate(Buffer.from(result.frames, "base64"), function (err, result) {
                        if (err)
                            next(err);
                        else
                            res.send(result.toString());
                    });
                }
            });
        }
        else
            next(400);
    }
});
Animation.route('resources', {
    detail: true,
    handler: function (req, res, next) {
        next();
    }
});
exports.AnimationSchema.index({ name: "text", description: "text", author: "text" }, { name: 'AnimationTextIndex', weights: { name: 10, description: 4, author: 2 } });
Animation.ensureIndexes(function (err) {
    if (err)
        winston.error(err);
    else
        winston.info('   AnimationTextIndex [OK]');
});
//# sourceMappingURL=animation.js.map