"use strict";
var mongoose = require('mongoose');
var restful = require('../libs/restful');
var sync_1 = require('./sync');
exports.AnimationSchema = new mongoose.Schema({
    localId: { type: String },
    name: { type: String, required: true },
    description: String,
    timer: Number,
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    dateCreated: { type: Number, required: true },
    dateModified: { type: Number, required: true },
    views: Number,
    rating: Number,
    category: String,
    isPublic: { type: Boolean, default: false },
    author: String,
    userId: { type: String, required: true },
    totalFrame: { type: Number, default: 0 },
    frames: { type: [], select: false }
});
exports.AnimationSchema.post('save', function (animation, next) {
    sync_1.createOrUpdateSync(animation.userId, animation._id, function (err, any) {
        next(err);
    });
});
exports.AnimationSchema.post('remove', function (animation, next) {
    sync_1.deleteSync(animation.userId, animation._id, function (err) {
        next(err);
    });
});
var Animation = restful.model('animations', exports.AnimationSchema);
exports.Animation = Animation;
Animation.methods(['get', 'put', 'post', 'delete']);
Animation.before('post', function (req, res, next) {
    var now = Date.now();
    if (!req.body.dateCreated)
        req.body.dateCreated = now;
    if (!req.body.dateModified)
        req.body.dateModified = now;
    if (!req.body.userId)
        req.body.userId = req.user._id;
    req.body.totalFrame = req.body.frames ? req.body.frames.length : 0;
    delete req.body._id;
    next();
});
Animation.before('put', function (req, res, next) {
    req.body.totalFrame = req.body.frames ? req.body.frames.length : 0;
    next();
});
Animation.route('frames', {
    detail: true,
    handler: function (req, res, next) {
        if (req.method === 'GET') {
            Animation.findOne({ _id: req.params.id }, "frames").lean().exec(function (err, result) {
                res.send(result.frames);
            });
        }
        else if (req.method == 'POST') {
            Animation.findOne({ _id: req.params.id }, function (err, result) {
                result.frames = req.body;
                result.totalFrame = result.frames.length;
                result.save();
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
//# sourceMappingURL=animation.js.map