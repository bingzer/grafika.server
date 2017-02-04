"use strict";
var aws_1 = require('../libs/aws');
var resource_1 = require('../models/resource');
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
    var resource = new resource_1.Resource({ _id: req.body._id });
    return aws.createSignedUrl(req.params.animationId, req.body.mime, resource).then(function (signedUrl) {
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
    var thumbnail = new resource_1.Thumbnail(req.params.animationId);
    aws.createSignedUrl(thumbnail.animationId, thumbnail.mime, thumbnail).then(function (signedUrl) {
        res.send(signedUrl);
    }).catch(next);
}
exports.createThumbnailSignedUrl = createThumbnailSignedUrl;
;
//# sourceMappingURL=resources.js.map