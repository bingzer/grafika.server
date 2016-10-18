"use strict";
var config = require('../configs/config');
var utils = require('../libs/utils');
var animation_1 = require("../models/animation");
var user_1 = require('../models/user');
function search(req, res, next) {
    if (req.query.term) {
        var sort = createSort(req);
        var query = createQuery(req);
        var limit = utils.safeParseInt(req.query.limit) < 0 ? 25 : utils.safeParseInt(req.query.limit);
        var skip = utils.safeParseInt(req.query.skip) < 0 ? 0 : utils.safeParseInt(req.query.skip);
        animation_1.Animation.find(query, { frames: 0 }).sort(sort).limit(limit).skip(skip).exec(function (err, result) {
            if (err)
                return next(err);
            res.json(result);
        });
    }
    else {
        next();
    }
}
exports.search = search;
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
function commentForMobile(req, res, next) {
    var disqusToken = (req.user) ? user_1.generateDisqusToken(req.user) : { public: "", token: "" };
    animation_1.Animation.findById(req.params._id, { frames: 0 }, function (err, anim) {
        if (err)
            return next(err);
        if (!anim)
            return next(404);
        var queryString = "url=" + config.setting.$content.$url + "animations/" + anim._id + "&title=" + anim.name + "&shortname=grafika-app&identifier=" + anim._id + "&pub=" + disqusToken.public + "&token=" + disqusToken.token;
        var url = config.setting.$content.$url + "app/content/comment.html?" + queryString;
        return res.redirect(url);
    });
}
exports.commentForMobile = commentForMobile;
function createQuery(req) {
    var qObject = { isPublic: true };
    if (req.query.term) {
        qObject.$text = { $search: req.query.term };
    }
    if (req.query.isPublic) {
        if (req.query.isPublic == "true")
            qObject.isPublic = true;
        if (req.query.isPublic == "false")
            qObject.isPublic = false;
    }
    return qObject;
}
function createSort(req) {
    var sort = {};
    if (req.query.sort === 'rating')
        sort.rating = -1;
    else if (req.query.sort === 'views')
        sort.views = -1;
    else if (req.query.sort === 'newest')
        sort.dateModified = -1;
    sort._id = -1;
    return sort;
}
//# sourceMappingURL=animation.js.map