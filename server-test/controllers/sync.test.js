var chai = require('chai');
var q = require('q');
var assert = chai.assert;
var expect = chai.expect;

describe("controllers/sync.ts", function (){
    var req, res, next;
	var mockery, mockSynchronizer;
    var Synchronizer;
	beforeEach(function (){
		mockery = require('mockery');
		mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
        
        Synchronizer = function(){};
        mockSynchronizer = { Synchronizer: Synchronizer };

        req = { body: {}, user: {} };
        res = undefined;
        next = undefined;
	});

	afterEach(function (){
		mockery.deregisterAll();
	});

    //////////////////////////////////////////////////////////////////////////////////////////

    describe("#sync()", function (){
        it("should sync and return SyncResult", function (done) {
            Synchronizer.prototype.sync = function(){
                var defer = q.defer();
                q.delay(100).then(function() {
                    defer.resolve({});
                });
                return defer.promise;
            }

            mockery.registerMock("../libs/synchronizer", mockSynchronizer);

            res = {
                send: function(syncResult){
                    assert.isOk(syncResult);
                    done();
                }
            }
            next = function(){
                done("Should not call next()");
            }

            var model = require("../../server/controllers/sync.js");
            model.sync(req, res, next);
        });

        it("should NOT sync and return SyncResult", function (done) {
            Synchronizer.prototype.sync = function(){
                var defer = q.defer();
                q.delay(100).then(function() {
                    defer.reject("Failed");
                });
                return defer.promise;
            }

            mockery.registerMock("../libs/synchronizer", mockSynchronizer);

            res = {
                send: function(syncResult){ done("Should return next()"); }
            }
            next = function(){
                done();
            }

            var model = require("../../server/controllers/sync.js");
            model.sync(req, res, next);
        });
    });

    describe("#syncUpdate()", function() {
        it("should perform sync update successfully", function (done) {
            Synchronizer.prototype.syncUpdate = function(){
                var defer = q.defer();
                q.delay(100).then(function() {
                    defer.resolve({});
                });
                return defer.promise;
            }

            mockery.registerMock("../libs/synchronizer", mockSynchronizer);

            req.body.sync = {};
            req.body.result = {};
            res = {
                sendStatus: function(status){
                    assert.equal(201, status);
                    done();
                }
            }
            next = function(){
                done("Should not call next()");
            }

            var model = require("../../server/controllers/sync.js");
            model.syncUpdate(req, res, next);
        });
        it("should fail to perform sync update (localSync is not found in the HttpRequest)", function (done) {
            Synchronizer.prototype.syncUpdate = function(){
                var defer = q.defer();
                q.delay(100).then(function() {
                    defer.resolve({});
                });
                return defer.promise;
            }

            mockery.registerMock("../libs/synchronizer", mockSynchronizer);

            req.body.result = {};
            res = {
                sendStatus: function(status){
                    done("Should call next()");
                }
            }
            next = function(){
                done();
            }

            var model = require("../../server/controllers/sync.js");
            model.syncUpdate(req, res, next);
        });
        it("should fail to perform sync update (syncResult is not found in the HttpRequest)", function (done) {
            Synchronizer.prototype.syncUpdate = function(){
                var defer = q.defer();
                q.delay(100).then(function() {
                    defer.resolve({});
                });
                return defer.promise;
            }

            mockery.registerMock("../libs/synchronizer", mockSynchronizer);

            req.body.sync = {};
            res = {
                sendStatus: function(status){
                    done("Should call next()");
                }
            }
            next = function(){
                done();
            }

            var model = require("../../server/controllers/sync.js");
            model.syncUpdate(req, res, next);
        });
        it("should fail to perform sync update (Generic Error)", function (done) {
            Synchronizer.prototype.syncUpdate = function(){
                var defer = q.defer();
                q.delay(100).then(function() {
                    defer.reject("Error");
                });
                return defer.promise;
            }

            mockery.registerMock("../libs/synchronizer", mockSynchronizer);

            req.body.sync = {};
            res = {
                sendStatus: function(status){
                    done("Should call next()");
                }
            }
            next = function(){
                done();
            }

            var model = require("../../server/controllers/sync.js");
            model.syncUpdate(req, res, next);
        });
    });
});