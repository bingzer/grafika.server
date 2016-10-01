var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe("controllers/users.ts", function (){
	var mockery;
	beforeEach(function (){
		mockery = require('mockery');
		mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
	});

	afterEach(function (){
		mockery.deregisterAll();
	});

    describe("#get()", function (){
        it("should return a user with email", function (done){
            var userReturned = { _id: "userId", email: "user@example.com", sanitize: function(){ return this } };
			var schema = {
                User: {
                    findById: function (userId, callback) {
                        assert.equal("userId", userId);
                        callback(undefined, userReturned);
                    },
                },
                isAdministrator: function(){ return false; }
            };
            var response = {
                send: function (result){
                    assert.equal("userId", result._id);
                    assert.equal("user@example.com", result.email);
                    done();
                }
            };
            var request = {
                user: userReturned,
                params: { _id: "userId" }
            }

			mockery.registerMock('../models/user', schema);

            var model = require("../../server/controllers/users.js");
            model.get(request, response);
        });

        it("should return a user with email deleted", function (done){
            var userReturned = { _id: "userId", email: "user@example.com", sanitize: function(){ return this } };
            var userRequested = { _id: "userIdx", email: "userx@example.com", sanitize: function(){ return this } };
			var schema = {
                User: {
                    findById: function (userId, callback) {
                        assert.equal("userId", userId);
                        callback(undefined, userReturned);
                    },
                },
                isAdministrator: function(){ return false; }
            };
            var response = {
                send: function (result){
                    assert.equal("userId", result._id);
                    assert.isUndefined(result.email);
                    done();
                }
            };
            var request = {
                user: userRequested,
                params: { _id: "userId" }
            }

			mockery.registerMock('../models/user', schema);

            var model = require("../../server/controllers/users.js");
            model.get(request, response);
        });

        it("should return a user with email (because an admin requested it)", function (done){
            var userReturned = { _id: "userId", email: "user@example.com", sanitize: function(){ return this } };
            var userRequested = { _id: "userIdx", email: "userx@example.com", sanitize: function(){ return this } };
			var schema = {
                User: {
                    findById: function (userId, callback) {
                        assert.equal("userId", userId);
                        callback(undefined, userReturned);
                    },
                },
                isAdministrator: function(){ return true; }
            };
            var response = {
                send: function (result){
                    assert.equal("userId", result._id);
                    assert.equal("user@example.com", result.email);
                    done();
                }
            };
            var request = {
                user: userRequested,
                params: { _id: "userId" }
            }

			mockery.registerMock('../models/user', schema);

            var model = require("../../server/controllers/users.js");
            model.get(request, response);
        });
        
        it("should return 404", function (done){
			var schema = {
                User: {
                    findById: function (userId, callback) {
                        callback();
                    },
                },
                isAdministrator: function(){ return false; }
            };
            var response = {};
            var next = function (err){
                assert.equal(404, err);
                done();
            }

			mockery.registerMock('../models/user', schema);

            var model = require("../../server/controllers/users.js");
            model.get({ params: { _id: "userId" }}, response, next);
        });
    })

    describe("update", function (){
        it("should NOT update user (empty request body)", function(done) {
            var next = function (err){
                done();
            }

            var model = require("../../server/controllers/users.js");
            model.update({ params: {} }, undefined, next);
        });
    });
});