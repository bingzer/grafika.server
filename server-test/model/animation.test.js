var chai = require('chai');
var assert = chai.assert;

describe('model/animation.ts', function(){
	var mockery, mockRestful;
	beforeEach(function (){
		mockery = require('mockery');
		mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
        
        mockRestful = {
            mockModel: {
                methods: function (verbs){},
                before: function() {},
                route: function() {},
                ensureIndexes: function(){}
            },
            model: function (name, schema) {
                return mockRestful.mockModel
            }
        }
	});

	afterEach(function (){
		mockery.deregisterAll();
	});

    it('should initialize properly', function (done) {
        mockery.registerMock('../libs/restful', mockRestful);
        var model = require('../../server/models/animation.js');
        done();
    });

    ////////////////////////////////////////////////////////////////////////////////////////

	describe("#methods()", function() {
		it('should have GET,PUT,POST', function (done) {
            mockRestful.mockModel.methods = function (verbs) {
                assert.equal('get', verbs[0]);
                assert.equal('put', verbs[1]);
                assert.equal('post', verbs[2]);
                done();
            };
            mockery.registerMock('../libs/restful', mockRestful);

			var model = require('../../server/models/animation.js');
		});
	});
    
	describe("#before('POST')", function() {
        var req, res, next;
	    beforeEach(function (){
            req = { 
                body: { _id: 'id', frames: [ {}] }, 
                user: { _id: "userId", prefs: { drawingAuthor: 'drawingAuthor'} } 
            };
            res = {};
        });

		it('should pre-process anim data before POST', function (done) {
            Date.now = function() { return 10; }
            next = function(){
                assert.isUndefined(req.body._id);
                assert.equal(10, req.body.dateCreated);
                assert.equal(10, req.body.dateModified);
                assert.equal("drawingAuthor", req.body.author);
                assert.equal(1, req.body.totalFrame);
                done();
            };

            mockRestful.mockModel.before = function (verb, callback) {
                if (verb == 'post'){
                    assert.equal('post', verb);
                    callback(req, res, next);
                }
            };
            mockery.registerMock('../libs/restful', mockRestful);

			var model = require('../../server/models/animation.js');
		});
		it('should pre-process anim data before POST (author should use username)', function (done) {
            Date.now = function() { return 10; }
            req.user.prefs.drawingAuthor = undefined;
            req.user.username = "username";
            next = function(){
                assert.isUndefined(req.body._id);
                assert.equal(10, req.body.dateCreated);
                assert.equal(10, req.body.dateModified);
                assert.equal("username", req.body.author);
                assert.equal(1, req.body.totalFrame);
                done();
            };

            mockRestful.mockModel.before = function (verb, callback) {
                if (verb == 'post'){
                    callback(req, res, next);
                }
            };
            mockery.registerMock('../libs/restful', mockRestful);

			var model = require('../../server/models/animation.js');
		});
	});

	describe("#before('GET')", function() {
        var req, res, next;
	    beforeEach(function (){
            req = { query: {} };
            res = {};
        });

		it('should have Animation.removed field to false if undefined', function (done) {
            assert.isUndefined(req.query.removed);

            next = function(){
                assert.equal(false, req.query.removed);
                done();
            }
            mockRestful.mockModel.before = function (verb, callback) {
                if (verb == 'get'){
                    callback(req, res, next);
                }
            };
            mockery.registerMock('../libs/restful', mockRestful);

			var model = require('../../server/models/animation.js');
		});
	});

	describe("#before('PUT')", function() {
        var req, res, next;
	    beforeEach(function (){
            req = { body: { totalFrame: 0, frames: [{},{}] } }; // 2 frames
            res = {};
        });

		it('should update totalFrame before PUT and removed frames property', function (done) {
            assert.equal(0, req.body.totalFrame);

            next = function(){
                assert.equal(2, req.body.totalFrame);
                assert.isUndefined(req.body.frames); // removed
                done();
            }
            mockRestful.mockModel.before = function (verb, callback) {
                if (verb == 'put'){
                    callback(req, res, next);
                }
            };
            mockery.registerMock('../libs/restful', mockRestful);

			var model = require('../../server/models/animation.js');
		});
        
		it('should update totalFrame to 0 when frame property is empty or undefined', function (done) {
            delete req.body.frames;
            req.body.totalFrame = 5;

            assert.equal(5, req.body.totalFrame);
            assert.isUndefined(req.body.frames);

            next = function(){
                assert.equal(0, req.body.totalFrame);
                assert.isUndefined(req.body.frames); // removed
                done();
            }
            mockRestful.mockModel.before = function (verb, callback) {
                if (verb == 'put'){
                    callback(req, res, next);
                }
            };
            mockery.registerMock('../libs/restful', mockRestful);

			var model = require('../../server/models/animation.js');
		});
	});

});