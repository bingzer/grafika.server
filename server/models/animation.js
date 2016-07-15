"use strict";
var mongoose = require('mongoose');
var restful = require('../libs/restful');
exports.AnimationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    timer: Number,
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    dateCreated: { type: Date, default: Date.now, required: true },
    dateModified: { type: Date, default: Date.now, required: true },
    views: Number,
    rating: Number,
    category: String,
    isPublic: { type: Boolean, default: false },
    author: String,
    userId: { type: String, required: true },
    frames: { type: [], select: false }
});
var Animation = restful.model('animations', exports.AnimationSchema);
exports.Animation = Animation;
Animation.methods(['get', 'put', 'post', 'delete']);
Animation.before('post', function (req, res, next) {
    if (!req.body.dateCreated)
        req.body.dateCreated = Date.now();
    if (!req.body.dateModified)
        req.body.dateModified = Date.now();
    if (!req.body.userId)
        req.body.userId = req.user._id;
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