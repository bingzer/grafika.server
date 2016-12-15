var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe("controllers/account.ts", function (){
	var mockery;
	beforeEach(function (){
		mockery = require('mockery');
		mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
	});

	afterEach(function (){
		mockery.deregisterAll();
	});

    describe("#login()", function (){
        it("should authenticate with local-login", function (done){
            var userReturned = { _id: "userId", email: "user@example.com", sanitize: function(){ return this } };
			var passport = {
                authenticate: function (name, callback) {
                    assert.equal('local-login', name);
                    callback(undefined, userReturned)
                    return function (){
                        done();
                    }
                }
            };
            var schema = {
                generateJwtToken: function (user) {
                    return "signed-jwt";
                },
                updateLastSeen: function (user) {
                    // do nothing
                }
            };
            var response = {
                send: function (result){
                    assert.equal("signed-jwt", result.token);
                }
            };
            var request = {
                user: userReturned,
                params: { _id: "userId" },
                login: function (user, errFn) {
                    errFn();
                }
            }

			mockery.registerMock('passport', passport);
			mockery.registerMock('../models/user', schema);

            var model = require("../../server/controllers/accounts.js");
            model.login(request, response);
        });
    });
});