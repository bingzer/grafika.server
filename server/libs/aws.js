"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $q = require("q");
var aws = require("aws-sdk");
var request = require("request");
var config = require("../configs/config");
var zlib = require("zlib");
////////////////////////////////////////////////////////////////////////////////
var AwsHelper = (function () {
    function AwsHelper() {
        aws.config.update({
            credentials: {
                accessKeyId: config.setting.$auth.$awsId,
                secretAccessKey: config.setting.$auth.$awsSecret
            }
        });
    }
    AwsHelper.prototype.create = function () {
        return new aws.S3();
    };
    return AwsHelper;
}());
var AwsUsers = (function (_super) {
    __extends(AwsUsers, _super);
    function AwsUsers() {
        return _super.apply(this, arguments) || this;
    }
    /**
     * Creates signed url
     */
    AwsUsers.prototype.createSignedUrl = function (user, imageType, mime) {
        var deferred = $q.defer();
        if (!imageType)
            imageType = 'avatar';
        if (!mime)
            mime = 'image/png';
        // get signedurl from s3
        var s3_params = {
            Bucket: config.setting.$auth.$awsBucket,
            Key: config.setting.$auth.$awsFolder + "/users/" + user._id + "/" + imageType,
            Expires: 600,
            ContentMD5: '',
            ContentType: mime,
            ACL: 'public-read'
        };
        this.create().getSignedUrl('putObject', s3_params, function (err, data) {
            if (err)
                deferred.reject(err);
            else
                deferred.resolve({ signedUrl: data, mime: mime });
        });
        return deferred.promise;
    };
    /**
     * Delete profile image (Avatar)
     * */
    AwsUsers.prototype.deleteAvatar = function (user, imageType) {
        var deferred = $q.defer();
        if (!imageType)
            imageType = 'avatar';
        this.create().deleteObject({
            Bucket: config.setting.$auth.$awsBucket,
            Key: config.setting.$auth.$awsFolder + "/users/" + user._id + "/" + imageType
        }, function (err, data) {
            if (err)
                deferred.reject(err);
            else
                deferred.resolve(data);
        });
        return deferred.promise;
    };
    return AwsUsers;
}(AwsHelper));
exports.AwsUsers = AwsUsers;
var AwsResources = (function (_super) {
    __extends(AwsResources, _super);
    function AwsResources() {
        return _super.apply(this, arguments) || this;
    }
    /**
     * Create SignedUrl for resources
     *
     * */
    AwsResources.prototype.createSignedUrl = function (resource) {
        var deferred = $q.defer();
        // get signedurl from s3
        var s3_params = {
            Bucket: config.setting.$auth.$awsBucket,
            Key: config.setting.$auth.$awsFolder + "/animations/" + resource.animationId + "/" + resource._id,
            Expires: 600,
            ContentMD5: '',
            ContentType: resource.mime,
            ACL: 'public-read'
        };
        this.create().getSignedUrl('putObject', s3_params, function (err, data) {
            if (err)
                deferred.reject(err);
            else
                deferred.resolve({ signedUrl: data, mime: resource.mime });
        });
        return deferred.promise;
    };
    /** Returns the resource url */
    AwsResources.prototype.getResourceUrl = function (animId, resourceId) {
        if (config.setting.$auth.$awsBucket === 'fake')
            return config.setting.$content.$url + "assets/img/placeholder.png";
        return "" + config.setting.$auth.$awsUrl + config.setting.$auth.$awsBucket + "/" + config.setting.$auth.$awsFolder + "/animations/" + animId + "/" + resourceId;
    };
    /** Delete resource */
    AwsResources.prototype.deleteResource = function (animId, resourceId) {
        var deferred = $q.defer();
        this.create().deleteObject({
            Bucket: config.setting.$auth.$awsBucket,
            Key: config.setting.$auth.$awsFolder + "/animations/" + animId + "/" + resourceId
        }, function (err, data) {
            if (err)
                deferred.reject(err);
            else
                deferred.resolve(data);
        });
        return deferred.promise;
    };
    return AwsResources;
}(AwsHelper));
exports.AwsResources = AwsResources;
var AwsAnimation = (function (_super) {
    __extends(AwsAnimation, _super);
    function AwsAnimation() {
        return _super.apply(this, arguments) || this;
    }
    /**
     * Delete animation and all resources under
     */
    AwsAnimation.prototype.deleteAnimation = function (animId) {
        var _this = this;
        var deferred = $q.defer();
        var params = {
            Bucket: config.setting.$auth.$awsBucket,
            Prefix: config.setting.$auth.$awsFolder + "/animations/" + animId
        };
        this.create().listObjects(params, function (err, data) {
            if (err)
                return deferred.reject(err);
            var params = {
                Bucket: config.setting.$auth.$awsBucket,
                Delete: {
                    Objects: []
                }
            };
            params.Delete.Objects.push({ Key: 'animations/' + animId });
            data.Contents.forEach(function (content) {
                params.Delete.Objects.push({ Key: content.Key });
            });
            _this.create().deleteObjects(params, function (err, data) {
                if (err)
                    return deferred.reject(err);
                return deferred.resolve(data);
            });
        });
        return deferred.promise;
    };
    return AwsAnimation;
}(AwsHelper));
exports.AwsAnimation = AwsAnimation;
var AwsFrames = (function (_super) {
    __extends(AwsFrames, _super);
    function AwsFrames() {
        return _super.apply(this, arguments) || this;
    }
    AwsFrames.prototype.postFrames = function (animation, req, res, next) {
        this.generatePOSTUrl(animation, function (err, signedUrl) {
            zlib.deflate(Buffer.from(req.body), function (err, result) {
                if (err)
                    return next(err);
                var xreq = request.put(signedUrl.signedUrl, { body: result });
                xreq.setHeader("Content-Type", "application/json");
                xreq.setHeader("Content-Encoding", "deflate");
                xreq.pipe(res, { end: true });
            });
        });
    };
    AwsFrames.prototype.getFrames = function (animation, req, res, next) {
        this.generateGETUrl(animation, function (err, signedUrl) {
            res.header('Content-Type', 'application/json');
            if (req.acceptsEncodings("deflate")) {
                res.header('Content-Encoding', 'deflate');
                request(signedUrl.signedUrl).pipe(res);
            }
            else {
                request(signedUrl.signedUrl, { encoding: null }, function (err, incoming, body) {
                    if (err)
                        return next(err);
                    zlib.inflate(body, function (err, result) {
                        if (err)
                            return next(err);
                        res.send(result);
                    });
                });
            }
        });
    };
    AwsFrames.prototype.generatePOSTUrl = function (animation, callback) {
        var animationId = animation._id ? animation._id : animation;
        var s3_params = {
            Bucket: config.setting.$auth.$awsBucket,
            Key: config.setting.$auth.$awsFolder + "/animations/" + animationId + "/frames",
            Expires: 600,
            ContentMD5: '',
            ContentType: 'application/json',
            ContentEncoding: 'deflate',
            ACL: 'authenticated-read'
        };
        this.create().getSignedUrl("putObject", s3_params, function (err, url) {
            callback(err, { signedUrl: url, mime: 'application/json' });
        });
    };
    /**
     * Generate GET Url for the specified URL
     */
    AwsFrames.prototype.generateGETUrl = function (animation, callback) {
        var animationId = animation._id ? animation._id : animation;
        var s3_params = {
            Bucket: config.setting.$auth.$awsBucket,
            Key: config.setting.$auth.$awsFolder + "/animations/" + animationId + "/frames",
            Expires: 600
        };
        this.create().getSignedUrl("getObject", s3_params, function (err, url) {
            callback(err, { signedUrl: url, mime: 'application/json' });
        });
    };
    return AwsFrames;
}(AwsHelper));
exports.AwsFrames = AwsFrames;
//# sourceMappingURL=aws.js.map