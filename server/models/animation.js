"use strict";
var mongoose = require('mongoose');
var winston = require('winston');
var restful = require('../libs/restful');
exports.AnimationSchema = new mongoose.Schema({
    localId: { type: String },
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
    frames: { type: [], select: false }
});
var Animation = restful.model('animations', exports.AnimationSchema);
exports.Animation = Animation;
Animation.methods(['get', 'put', 'post']);
Animation.before('post', function (req, res, next) {
    var now = Date.now();
    if (!req.body.dateCreated)
        req.body.dateCreated = now;
    if (!req.body.dateModified)
        req.body.dateModified = now;
    if (!req.body.userId)
        req.body.userId = req.user._id;
    if (!req.body.author)
        req.body.author = req.user.prefs.drawingAuthor || req.user.username;
    req.body.totalFrame = req.body.frames ? req.body.frames.length : 0;
    delete req.body._id;
    next();
});
Animation.before('get', function (req, res, next) {
    if (req.query && typeof (req.query.removed) === 'undefined')
        req.query.removed = false;
    next();
});
Animation.before('put', function (req, res, next) {
    req.body.totalFrame = req.body.frames ? req.body.frames.length : 0;
    delete req.body.frames;
    next();
});
Animation.route('frames', {
    detail: true,
    handler: function (req, res, next) {
        if (req.method === 'GET') {
            Animation.db.collections.animations.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, { frames: 1 }, function (err, result) {
                if (err)
                    return next(err);
                if (!result)
                    return next(400);
                res.send(result.frames);
            });
        }
        else if (req.method == 'POST') {
            Animation.db.collections.animations.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, { $set: { 'frames': req.body } }, function (err) {
                if (err)
                    return next(err);
                res.sendStatus(201);
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