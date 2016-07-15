"use strict";
var mongoose = require('mongoose');
var aws_1 = require('../libs/aws');
var resource_1 = require('../models/resource');
function createThumbnailSignedUrl(req, res, next) {
    var animId = new mongoose.Types.ObjectId(req.params.animationId);
    var resource = new resource_1.Resource({ name: 'thumbnail', mime: 'image/png', animationId: animId });
    var aws = new aws_1.AwsResources();
    aws.createSignedUrl(resource).then(function (signedUrl) {
        res.send(signedUrl);
    }).catch(next);
}
exports.createThumbnailSignedUrl = createThumbnailSignedUrl;
;
//# sourceMappingURL=resource.js.map