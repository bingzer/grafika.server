var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe("libs/aws.ts", function (){
	var mockery, mockConfig, mockAwsSdk;

    ///////////////////////////////////////////////////////////////////////////

	beforeEach(function (){
		mockery = require('mockery');
		mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
        
        mockConfig = {
            setting: {
                $auth: {
                    $awsId: 'awsId',
                    $awsSecret: 'awsSecret',
                    $awsBucket: 'awsBucket',
                    $awsFolder: 'awsFolder',
                    $awsUrl: 'awsUrl/'
                },
                $content: {
                    
                }
            }
        };
        mockAwsSdk = {
            S3: function(opt) {
                assert.equal('awsId', opt.accessKeyId);
                assert.equal('awsSecret', opt.secretAccessKey);
            }
        };
	});

	afterEach(function (){
		mockery.deregisterAll();
	});

    ///////////////////////////////////////////////////////////////////////////

    describe("#AwsUsers", function (){
        describe("#createSignedUrl", function (){
            it("should create a Signed URL", function (done){
                mockAwsSdk.getSignedUrl = function(name, params, callback) {
                    assert.equal('putObject', name);
                    assert.equal('awsBucket', params.Bucket);
                    assert.equal('awsFolder/users/_id/imageType', params.Key);
                    assert.equal(600, params.Expires);
                    assert.equal('', params.ContentMD5);
                    assert.equal('mime', params.ContentType);
                    assert.equal('public-read', params.ACL);
                    callback(undefined, 'signed-url');
                }

                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsUser = new model.AwsUsers();
                awsUser.create = function() {
                    return mockAwsSdk;
                };
                awsUser.createSignedUrl({_id: '_id'}, 'imageType', 'mime').then(function (result) {
                    assert.equal('signed-url', result.signedUrl);
                    assert.equal('mime', result.mime);
                    done();
                });
            });
            it("should NOT create a Signed URL", function (done){
                mockAwsSdk.getSignedUrl = function(name, params, callback) {
                    assert.equal('putObject', name);
                    assert.equal('awsBucket', params.Bucket);
                    assert.equal('awsFolder/users/_id/imageType', params.Key);
                    assert.equal(600, params.Expires);
                    assert.equal('', params.ContentMD5);
                    assert.equal('mime', params.ContentType);
                    assert.equal('public-read', params.ACL);
                    callback('error');
                }

                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsUser = new model.AwsUsers();
                awsUser.create = function() {
                    return mockAwsSdk;
                };
                awsUser.createSignedUrl({_id: '_id'}, 'imageType', 'mime').catch(function (result) {
                    assert.equal('error', result);
                    done();
                });
            });
        });

        describe("#deleteAvatar", function(){
            it("should delete avatar from AWS S3", function(done) {
                var deleteObjectCalled = false;
                mockAwsSdk.deleteObject = function(params, callback) {
                    deleteObjectCalled = true;
                    assert.equal('awsBucket', params.Bucket);
                    assert.equal('awsFolder/users/_id/avatar', params.Key);
                    callback(undefined, 'OK');
                }

                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsUser = new model.AwsUsers();
                awsUser.create = function() { return mockAwsSdk; };

                awsUser.deleteAvatar({_id: '_id'}, 'avatar').then(function (result) {
                    assert.equal('OK', result);
                    assert.isOk(deleteObjectCalled);
                    done();
                });
            });
            it("should NOT delete avatar from AWS S3 and returns error", function(done) {
                var deleteObjectCalled = false;
                mockAwsSdk.deleteObject = function(params, callback) {
                    deleteObjectCalled = true;
                    assert.equal('awsBucket', params.Bucket);
                    assert.equal('awsFolder/users/_id/avatar', params.Key);
                    callback("Error");
                }

                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsUser = new model.AwsUsers();
                awsUser.create = function() { return mockAwsSdk; };

                awsUser.deleteAvatar({_id: '_id'}, 'avatar').catch(function (result) {
                    assert.equal('Error', result);
                    assert.isOk(deleteObjectCalled);
                    done();
                });
            });
        });
    });

    ///////////////////////////////////////////////////////////////////////////
    
    describe("#AwsResources", function (){
        describe("#createSignedUrl", function (){
            it("should create a Signed URL", function (done){
                mockAwsSdk.getSignedUrl = function(name, params, callback) {
                    assert.equal('putObject', name);
                    assert.equal('awsBucket', params.Bucket);
                    assert.equal('awsFolder/animations/animationId/resourceId', params.Key);
                    assert.equal(600, params.Expires);
                    assert.equal('', params.ContentMD5);
                    assert.equal('resourceMime', params.ContentType);
                    assert.equal('public-read', params.ACL);
                    callback(undefined, 'signed-url');
                }

                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsResource = new model.AwsResources();
                awsResource.create = function() {
                    return mockAwsSdk;
                };
                awsResource.createSignedUrl({_id: 'resourceId', animationId: 'animationId', mime: 'resourceMime'}).then(function (result) {
                    assert.equal('signed-url', result.signedUrl);
                    assert.equal('resourceMime', result.mime);
                    done();
                });
            });
            it("should NOT create a Signed URL and returns error", function (done){
                mockAwsSdk.getSignedUrl = function(name, params, callback) {
                    assert.equal('putObject', name);
                    assert.equal('awsBucket', params.Bucket);
                    assert.equal('awsFolder/animations/animationId/resourceId', params.Key);
                    assert.equal(600, params.Expires);
                    assert.equal('', params.ContentMD5);
                    assert.equal('resourceMime', params.ContentType);
                    assert.equal('public-read', params.ACL);
                    callback('Error');
                }

                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsResource = new model.AwsResources();
                awsResource.create = function() {
                    return mockAwsSdk;
                };
                awsResource.createSignedUrl({_id: 'resourceId', animationId: 'animationId', mime: 'resourceMime'}).catch(function (result) {
                    assert.equal('Error', result);
                    done();
                });
            });
        });

        describe("#getResourceUrl", function (){
            it("should returns Resource Url", function (done){
                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsResource = new model.AwsResources();

                var url = awsResource.getResourceUrl('animId', 'resourceId');
                assert.equal('awsUrl/awsBucket/awsFolder/animations/animId/resourceId', url);
                done();
            });

            it("should returns Resource Fake Url (when setting.awsBucket == fake)", function (done){
                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                // config.setting.$content.$url + 'assets/img/placeholder.png'
                mockConfig.setting.$auth.$awsBucket = 'fake';
                mockConfig.setting.$content.$url = 'http://fake.com/';

                var model = require("../../server/libs/aws.js");
                var awsResource = new model.AwsResources();

                var url = awsResource.getResourceUrl('animId', 'resourceId');
                assert.equal('http://fake.com/assets/img/placeholder.png', url);
                done();
            });
        });

        describe("#deleteResource", function (){
            it("should delete the resource from AWS S3", function (done){
                mockAwsSdk.deleteObject = function(params, callback) {
                    assert.equal('awsBucket', params.Bucket);
                    assert.equal('awsFolder/animations/animationId/resourceId', params.Key);
                    callback(undefined, 'OK');
                }

                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsResource = new model.AwsResources();
                awsResource.create = function() { return mockAwsSdk; };

                awsResource.deleteResource('animationId', 'resourceId').done(function (result) {
                    assert.equal('OK', result);
                    done();
                });
            });
            it("should NOT delete the resource from AWS S3 and returns Error", function (done){
                mockAwsSdk.deleteObject = function(params, callback) {
                    assert.equal('awsBucket', params.Bucket);
                    assert.equal('awsFolder/animations/animationId/resourceId', params.Key);
                    callback('Error');
                }

                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsResource = new model.AwsResources();
                awsResource.create = function() { return mockAwsSdk; };

                awsResource.deleteResource('animationId', 'resourceId').catch(function (result) {
                    assert.equal('Error', result);
                    done();
                });
            });
        });
    });

    ///////////////////////////////////////////////////////////////////////////
    
    describe("#AwsAnimation", function (){
        describe("#deleteAnimation", function (){
            it("should delete the animation from AWS S3", function (done){
                mockAwsSdk.listObjects = function(params, callback) {
                    assert.equal('awsBucket', params.Bucket);
                    assert.equal('awsFolder/animations/animationId', params.Prefix);
                    callback(undefined, { Contents: [
                        { key: 'key1' },
                        { key: 'key2' },
                    ]});
                }
                mockAwsSdk.deleteObjects = function(params, callback) {
                    assert.equal(3, params.Delete.Objects.length); // including the parent folder
                    assert.equal('awsBucket', params.Bucket);
                    callback(undefined, 'OK');
                }

                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsResource = new model.AwsAnimation();
                awsResource.create = function() { return mockAwsSdk; };

                awsResource.deleteAnimation('animationId').done(function (result) {
                    assert.equal('OK', result);
                    done();
                });
            });
            it("should NOT delete the animation from AWS S3 and returns error", function (done){
                mockAwsSdk.listObjects = function(params, callback) {
                    assert.equal('awsBucket', params.Bucket);
                    assert.equal('awsFolder/animations/animationId', params.Prefix);
                    callback('Error');
                }
                mockAwsSdk.deleteObjects = function(params, callback) {
                    assert.equal(3, params.Delete.Objects.length); // including the parent folder
                    assert.equal('awsBucket', params.Bucket);
                    callback(undefined, 'OK');
                }

                mockery.registerMock('../configs/config', mockConfig);
                mockery.registerMock('aws-sdk', mockAwsSdk);

                var model = require("../../server/libs/aws.js");
                var awsResource = new model.AwsAnimation();
                awsResource.create = function() { return mockAwsSdk; };

                awsResource.deleteAnimation('animationId').catch(function (result) {
                    assert.equal('Error', result);
                    done();
                });
            });
        });
    });

});