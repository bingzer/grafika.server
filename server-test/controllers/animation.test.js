var chai = require('chai');
var q = require('q');
var assert = chai.assert;
var expect = chai.expect;

describe("controllers/animation.ts", function (){
    var req, res, next;
	var mockery, mockAnimation;

    var Animation;

	beforeEach(function (){
		mockery = require('mockery');
		mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });

        mockAnimation = {
            Animation: {}
        }

        mockAnimation.Animation.find = function (query, fields) {
            return mockAnimation.Animation;
        }
        mockAnimation.Animation.sort = function (sort) {
            return mockAnimation.Animation;
        }
        mockAnimation.Animation.limit = function (limit) {
            return mockAnimation.Animation;
        }
        mockAnimation.Animation.skip = function(skip) {
            return mockAnimation.Animation;
        }
        mockAnimation.Animation.exec = function (callback) {
            callback();
        }
        mockery.registerMock("../models/animation", mockAnimation);

        req = { body: {}, user: {}, query: {}, params: {} };
        res = {};
        next = undefined;
	});

	afterEach(function (){
		mockery.deregisterAll();
	});

    /////////////////////////////////////////////////////////////////////////////////////////

    describe("#search()", function (){

        it("should perform search", function (done) {
            mockAnimation.Animation.exec = function (callback) {
                callback(undefined, [{ _id: "1" }, { _id: "2" }]);
            };

            req.query.term = "term";
            res.json = function(result){
                assert.equal(2, result.length);
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should exclude frame properties from Animation", function (done) {
            mockAnimation.Animation.find = function (query, fields) {
                assert.equal(0, fields.frames);
                return mockAnimation.Animation;
            }

            req.query.term = "sweet mocha";
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should perform search with term = 'sweet mocha'", function (done) {
            mockAnimation.Animation.find = function (query) {
                assert.equal('sweet mocha', query.$text.$search);
                return mockAnimation.Animation;
            }

            req.query.term = "sweet mocha";
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should sort by rating", function (done) {
            mockAnimation.Animation.sort = function (sort) {
                assert.equal("-1", sort.rating);
                assert.equal("-1", sort._id);
                return mockAnimation.Animation;
            }

            req.query.term = "term";
            req.query.sort = "rating";
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should sort by views", function (done) {
            mockAnimation.Animation.sort = function (sort) {
                assert.equal("-1", sort.views);
                assert.equal("-1", sort._id);
                return mockAnimation.Animation;
            }

            req.query.term = "term";
            req.query.sort = "views";
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should sort by newest", function (done) {
            mockAnimation.Animation.sort = function (sort) {
                assert.equal("-1", sort.modifiedDate);
                assert.equal("-1", sort._id);
                return mockAnimation.Animation;
            }

            req.query.term = "term";
            req.query.sort = "newest";
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should page (undefined - default to 25)", function (done) {
            mockAnimation.Animation.limit = function (limit) {
                assert.equal(25, limit);
                return mockAnimation.Animation;
            }

            req.query.term = "term";
            req.query.limit = undefined;
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should page (less than 0 - default to 25)", function (done) {
            mockAnimation.Animation.limit = function (limit) {
                assert.equal(25, limit);
                return mockAnimation.Animation;
            }

            req.query.term = "term";
            req.query.limit = -4;
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should page (limit = 100)", function (done) {
            mockAnimation.Animation.limit = function (limit) {
                assert.equal(100, limit);
                return mockAnimation.Animation;
            }

            req.query.term = "term";
            req.query.limit = 100;
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should page (skip -> default to 0)", function (done) {
            mockAnimation.Animation.skip = function (skip) {
                assert.equal(0, skip);
                return mockAnimation.Animation;
            }

            req.query.term = "term";
            req.query.skip = undefined;
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should page (skip less than 0, default to 0)", function (done) {
            mockAnimation.Animation.skip = function (skip) {
                assert.equal(0, skip);
                return mockAnimation.Animation;
            }

            req.query.term = "term";
            req.query.skip = -99;
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
        
        it("should page (skip = 8)", function (done) {
            mockAnimation.Animation.skip = function (skip) {
                assert.equal(8, skip);
                return mockAnimation.Animation;
            }

            req.query.term = "term";
            req.query.skip = 8;
            res.json = function(result){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });

        it("should not perform search (requires req.query.term)", function (done) {
            next = function(){
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.search(req, res, next);
        });
    });

    describe("#remove()", function (){
        it("should remove an animation (setting removed flag to true)", function (done){
            mockAnimation.Animation.findByIdAndUpdate = function (id, update, callback) {
                assert.equal("_id", id);
                assert.equal(true, update.removed);
                callback(undefined, {});
            }

            req.params._id = "_id";
            res.sendStatus = function(status) {
                assert.equal(200, status);
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.remove(req, res, next);
        });
        
        it("should fail to remove an animation (404 - animation not found)", function (done){
            mockAnimation.Animation.findByIdAndUpdate = function (id, update, callback) {
                assert.equal("_id", id);
                assert.equal(true, update.removed);
                callback();
            }

            req.params._id = "_id";
            next = function (status) {
                assert.equal(404, status);
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.remove(req, res, next);
        });
        
        it("should fail to remove an animation (Generic Error)", function (done){
            mockAnimation.Animation.findByIdAndUpdate = function (id, update, callback) {
                assert.equal("_id", id);
                assert.equal(true, update.removed);
                callback('error');
            }

            req.params._id = "_id";
            next = function (status) {
                assert.equal('error', status);
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.remove(req, res, next);
        });
    });
    
    describe("#incrementViewCount()", function (){
        it("should increment view count and update last modified", function (done){
            Date.now = function() { return 100; };
            mockAnimation.Animation.findByIdAndUpdate = function (id, update, callback) {
                assert.equal("_id", id);
                assert.equal(1, update.$inc.views);
                assert.equal(100, update.dateModified);

                callback(undefined, {});
            }

            req.params._id = "_id";
            res.sendStatus = function(status) {
                assert.equal(200, status);
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.incrementViewCount(req, res, next);
        });
    });
    
    describe("#submitRating()", function (){
        it("should submit rating and update the dateModified", function (done){
            var animation = {
                rating: 3,
                save: function (callback) {
                    callback(undefined, animation);
                }
            };

            Date.now = function() { return 100; };
            mockAnimation.Animation.findById = function (id, fields, callback) {
                assert.equal("_id", id);
                assert.equal(0, fields.frames);
                callback(undefined, animation);
            }

            req.params._id = "_id";
            req.params.rating = 4;
            res.send = function(status, body) {
                assert.equal(201, status);
                assert.equal(3.5, body);
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.submitRating(req, res, next);
        });
    });
    
    describe("#commentForMobile()", function (){
        it("should return redirect to url made for disqus mobile", function (done){
            var animation = {
                _id: '_id',
                name: 'name',
                rating: 3,
                save: function (callback) {
                    callback(undefined, animation);
                }
            };

            var mockDisqusToken = {
                generateDisqusToken: function(user){
                    return {
                        token: 'disqus-token-' + user._id,
                        public: 'disqus-public'
                    };
                }
            };

            mockery.registerMock('../models/user', mockDisqusToken);
            
            mockAnimation.Animation.findById = function (id, fields, callback) {
                assert.equal("_id", id);
                assert.equal(0, fields.frames);
                callback(undefined, animation);
            }

            req.params._id = "_id";
            req.params.rating = 4;
            req.user._id = "_userId";
            res.redirect = function (url) {
                assert.equal("/app/content/comment.html?url=http://grafika.bingzer.com/animations/_id&title=name&shortname=grafika-app&identifier=_id&pub=disqus-public&token=disqus-token-_userId", url);
                done();
            }

            var model = require("../../server/controllers/animation.js");
            model.commentForMobile(req, res, next);
        });
    });
    
});