"use strict";
var fs = require("fs-extra");
var path = require("path");
var config = require("../configs/config");
var utils = require("../libs/utils");
var animation_1 = require("../models/animation");
var user_1 = require("../models/user");
var mailer_1 = require("../libs/mailer");
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
function getRandomAnimation(req, res, next) {
    var criteria = { removed: false, isPublic: true, $where: "this.totalFrame > 5" };
    animation_1.Animation.find(criteria).lean().count(function (err, count) {
        if (err)
            return next(err);
        var random = Math.floor(Math.random() * count);
        animation_1.Animation.findOne(criteria).skip(random).lean().exec(function (err, result) {
            if (err)
                return next(err);
            res.send(result);
        });
    });
}
exports.getRandomAnimation = getRandomAnimation;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function postComment(req, res, next) {
    animation_1.Animation.findById(req.params._id, function (err, anim) {
        if (err)
            return next(err);
        if (!anim)
            return next(404);
        user_1.User.findById(anim.userId, function (err, user) {
            if (user.subscriptions.emailAnimationComment) {
                mailer_1.sendAnimationCommentEmail(anim, user, req.body)
                    .then(function () { return res.sendStatus(201); })
                    .catch(function (err) { return next(err); });
            }
        });
    });
}
exports.postComment = postComment;
function commentForMobile(req, res, next) {
    var disqusToken = (req.user) ? user_1.generateDisqusToken(req.user) : { public: "", token: "" };
    var jwtToken = (req.user) ? user_1.generateJwtToken(req.user) : "";
    animation_1.Animation.findById(req.params._id, { frames: 0 }, function (err, anim) {
        if (err)
            return next(err);
        if (!anim)
            return next(404);
        var postUrl = config.setting.$server.$url + "animations/" + anim._id + "/comments";
        var queryString = "url=" + config.setting.$content.$url + "animations/" + anim._id + "&title=" + anim.name + "&shortname=grafika-app&identifier=" + anim._id + "&pub=" + disqusToken.public + "&disqusToken=" + disqusToken.token + "&postUrl=" + postUrl + "&jwtToken=" + jwtToken;
        var url = config.setting.$content.$url + "app/content/comment.html?" + queryString;
        return res.redirect(url);
    });
}
exports.commentForMobile = commentForMobile;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function seo(req, res, next) {
    var animationId = req.params._id;
    var isCrawler = /bot|facebookexternalhit\/[0-9]|Twitterbot|Pinterest|Google.*snippet/i.test(req.header("user-agent"));
    if (!isCrawler)
        res.redirect(config.setting.$content.$url + "animations/" + animationId);
    else if (isCrawler) {
        animation_1.Animation.findById(animationId, function (err, anim) {
            fs.readFile(path.resolve('server/templates/animation-seo.html'), 'utf-8', function (err, data) {
                if (err)
                    return next(err);
                data = data.replace('{{url}}', config.setting.$server.$url + "animations/" + anim._id + "/seo");
                data = data.replace('{{title}}', "" + anim.name);
                data = data.replace('{{description}}', "" + anim.description);
                data = data.replace('{{image}}', config.setting.$server.$url + "animations/" + anim.id + "/thumbnail");
                res.contentType('text/html').send(data);
            });
        });
    }
}
exports.seo = seo;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    //qObject.userId = req.query.userId;
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