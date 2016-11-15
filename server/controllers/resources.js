"use strict";
var mongoose = require("mongoose");
var aws_1 = require("../libs/aws");
var resource_1 = require("../models/resource");
var aws = new aws_1.AwsResources();
function get(req, res, next) {
    var animId = req.params.animationId;
    var resourceId = req.params._id;
    res.redirect(aws.getResourceUrl(animId, resourceId));
}
exports.get = get;
function del(req, res, next) {
    var animId = req.params.animationId;
    var resourceId = req.params._id;
    aws.deleteResource(animId, resourceId).then(function (ret) {
        res.sendStatus(200);
    });
}
exports.del = del;
function createSignedUrl(req, res, next) {
    var animId = new mongoose.Types.ObjectId(req.params.animationId);
    var resource = new resource_1.Resource({ _id: req.body._id, mime: req.body.mime, animationId: animId });
    return aws.createSignedUrl(resource).then(function (signedUrl) {
        res.send(signedUrl);
    }).catch(next);
}
exports.createSignedUrl = createSignedUrl;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getThumbnail(req, res, next) {
    var animId = req.params.animationId;
    res.redirect(aws.getResourceUrl(animId, "thumbnail"));
}
exports.getThumbnail = getThumbnail;
function createThumbnailSignedUrl(req, res, next) {
    var animId = new mongoose.Types.ObjectId(req.params.animationId);
    var resource = new resource_1.Resource({ _id: 'thumbnail', mime: 'image/png', animationId: animId });
    aws.createSignedUrl(resource).then(function (signedUrl) {
        res.send(signedUrl);
    }).catch(next);
}
exports.createThumbnailSignedUrl = createThumbnailSignedUrl;
;
//# sourceMappingURL=resources.js.map