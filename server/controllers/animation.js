"use strict";
var animation_1 = require("../models/animation");
function remove(req, res, next) {
    animation_1.Animation.findByIdAndUpdate(req.params._id, { removed: true }, function (err, anim) {
        if (err)
            return next(err);
        if (!anim)
            return next(404);
        return res.sendStatus(200);
    });
}
exports.remove = remove;
function incrementViewCount(req, res, next) {
    animation_1.Animation.findByIdAndUpdate(req.params._id, { $inc: { views: 1 } }, function (err, anim) {
        if (err)
            return next(err);
        if (!anim)
            return next(404);
        return res.sendStatus(200);
    });
}
exports.incrementViewCount = incrementViewCount;
function submitRating(req, res, next) {
    var rating = parseInt(req.params.rating);
    if (!rating)
        return next(400);
    if (rating <= 0 && rating >= 5)
        return next(400);
    animation_1.Animation.findById(req.params._id, { frames: 0 }, function (err, anim) {
        if (err)
            return next(err);
        if (!anim)
            return next(404);
        anim.rating = (anim.rating + rating) / 2;
        anim.save(function (err, result) {
            if (err)
                return next(err);
            res.send(201, result.rating);
        });
    });
}
exports.submitRating = submitRating;
//# sourceMappingURL=animation.js.map