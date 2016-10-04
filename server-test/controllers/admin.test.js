var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe("controllers/admin.ts", function (){
	var mockery;
	beforeEach(function (){
		mockery = require('mockery');
		mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
	});

	afterEach(function (){
		mockery.deregisterAll();
	});

    describe("#get()", function (){
        it("should return ServerInfo's sensitive data hidden", function (done){
            var trueValue = 'shouldbehidden';
            var mockConfig = {
                setting: {
                    test: 'test',
                    client: { sessionSecret: trueValue },
                    server: { 
                        superSecret: trueValue,
                        databaseUrl: trueValue,
                        mailPassword: trueValue,
                    },
                    auth: {
                        googleSecret: trueValue,
                        disqusSecret: trueValue,
                        awsSecret: trueValue
                    },
                    $server: {

                    },
                }
            };
			mockery.registerMock('../configs/config', mockConfig);

            var response = {
                json: function(info) {
                    assert.notEqual(trueValue, info.client.sessionSecret);
                    assert.notEqual(trueValue, info.server.superSecret);
                    assert.notEqual(trueValue, info.server.databaseUrl);
                    assert.notEqual(trueValue, info.server.mailPassword);
                    assert.notEqual(trueValue, info.auth.googleSecret);
                    assert.notEqual(trueValue, info.auth.facebookSecret);
                    assert.notEqual(trueValue, info.auth.disqusSecret);
                    assert.notEqual(trueValue, info.auth.awsSecret);
                    done();
                }
            };

            var model = require("../../server/controllers/admin.js");
            model.get(undefined, response);
        });
    });

    describe("#listUsers()", function(){
        it("should list all users", function (done) {
            var mockUser = {}
            mockUser.User = {};
            mockUser.User.find = function (query) {
                return mockUser.User;
            };
            mockUser.User.limit = function(limit) {
                return mockUser.User;
            };
            mockUser.User.skip = function (skip) {
                return mockUser.User;
            };
            mockUser.User.sort = function (skip) {
                return mockUser.User;
            };
            mockUser.User.exec = function (callback) {
                callback(undefined, [
                    {_id: 'id1'},
                    {_id: 'id2'}
                ]);
            };
			mockery.registerMock('../models/user', mockUser);

            var request = {
                query: {}
            };
            var response = {
                json: function(result){
                    assert.equal(2, result.length);
                    done();
                }
            };

            var model = require("../../server/controllers/admin.js");
            model.listUsers(request, response);
        });
    });

    describe("#listAnimations()", function() {
        it("should return animations", function (done){
            var mockAnimation = {}
            mockAnimation.Animation = {};
            mockAnimation.Animation.find = function (query) {
                return mockAnimation.Animation;
            };
            mockAnimation.Animation.limit = function(limit) {
                return mockAnimation.Animation;
            };
            mockAnimation.Animation.skip = function (skip) {
                return mockAnimation.Animation;
            };
            mockAnimation.Animation.sort = function (skip) {
                return mockAnimation.Animation;
            };
            mockAnimation.Animation.limit = function (skip) {
                return mockAnimation.Animation;
            };
            mockAnimation.Animation.exec = function (callback) {
                callback(undefined, [
                    {_id: 'id1'},
                    {_id: 'id2'}
                ]);
            };
			mockery.registerMock('../models/animation', mockAnimation);

            var request = {
                query: {}
            };
            var response = {
                json: function(result){
                    assert.equal(2, result.length);
                    done();
                }
            };

            var model = require("../../server/controllers/admin.js");
            model.listAnimations(request, response);
        });
    });
});