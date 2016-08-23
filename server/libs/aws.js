"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $q = require('q');
var aws = require('aws-sdk');
var config = require('../configs/config');
var AwsHelper = (function () {
    function AwsHelper() {
    }
    AwsHelper.prototype.create = function () {
        return new aws.S3({ accessKeyId: config.setting.$auth.$awsId, secretAccessKey: config.setting.$auth.$awsSecret });
    };
    return AwsHelper;
}());
var AwsUsers = (function (_super) {
    __extends(AwsUsers, _super);
    function AwsUsers() {
        _super.apply(this, arguments);
    }
    AwsUsers.prototype.createSignedUrl = function (user, imageType, mime) {
        var deferred = $q.defer();
        if (!imageType)
            imageType = 'avatar';
        if (!mime)
            mime = 'image/png';
        var s3 = new aws.S3({ accessKeyId: config.setting.$auth.$awsId, secretAccessKey: config.setting.$auth.$awsSecret });
        var s3_params = {
            Bucket: config.setting.$auth.$awsBucket,
            Key: 'grafika/users/' + user._id + '/' + imageType,
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
    AwsUsers.prototype.deleteAvatar = function (user, imageType) {
        var deferred = $q.defer();
        if (!imageType)
            imageType = 'avatar';
        this.create().deleteObject({
            Bucket: config.setting.$auth.$awsBucket,
            Key: 'grafika/users/' + user._id + '/' + imageType
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
        _super.apply(this, arguments);
    }
    AwsResources.prototype.createSignedUrl = function (resource) {
        var deferred = $q.defer();
        var s3_params = {
            Bucket: config.setting.$auth.$awsBucket,
            Key: 'grafika/animations/' + resource.animationId + '/' + resource._id,
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
    AwsResources.prototype.getResourceUrl = function (animId, resourceId) {
        if (config.setting.$auth.$awsBucket === 'fake')
            return '/assets/img/placeholder.png';
        return config.setting.$auth.$awsUrl + config.setting.$auth.$awsBucket + '/grafika/animations/' + animId + "/" + resourceId;
    };
    AwsResources.prototype.deleteResource = function (animId, resourceId) {
        var deferred = $q.defer();
        this.create().deleteObject({
            Bucket: config.setting.$auth.$awsBucket,
            Key: 'grafika/animations/' + animId + '/' + resourceId
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
        _super.apply(this, arguments);
    }
    AwsAnimation.prototype.deleteAnimation = function (animId) {
        var _this = this;
        var deferred = $q.defer();
        var params = {
            Bucket: config.setting.$auth.$awsBucket,
            Prefix: 'grafika/animations/' + animId
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
//# sourceMappingURL=aws.js.map