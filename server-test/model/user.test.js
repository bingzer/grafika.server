var chai = require('chai');
var assert = chai.assert;

describe('model/user.ts', function(){
	var mockery;
	beforeEach(function (){
		mockery = require('mockery');
		mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
	});

	afterEach(function (){
		mockery.deregisterAll();
	});

	describe("#generateJwtToken()", function() {
		it('should generate JWT Token', function (done) {
			var jwtMock = {
				sign: function (user, secret, opt) {
					assert.isOk(user);
					assert.isOk(opt);
					assert.isOk(opt);
					assert.equal('24h', opt.expiresIn)
					return "signed-jwt";
				}
			};

			mockery.registerMock('jsonwebtoken', jwtMock);

			var model = require('../../server/models/user.js');
			assert.equal("signed-jwt", model.generateJwtToken({ }));
			done();
		});
	});

	
	describe("#verifyJwtToken()", function() {
		it('should verify JWT Token', function (done) {
			var jwtMock = {
				verify: function (token, secret, opt, callback) {
					assert.equal('signed-jwt', token);
					assert.isOk(opt);
					assert.isOk(opt);
					callback(undefined, { username: 'username'});
				}
			};

			mockery.registerMock('jsonwebtoken', jwtMock);

			var model = require('../../server/models/user.js');
			model.verifyJwtToken('signed-jwt', function (err, user){
				assert.isUndefined(err);
				assert.equal('username', user.username);
				done();
			});
		});
	});

	describe('#sanitize()', function(){
		it('should sanitize user data', function(done) {
			var model = require('../../server/models/user.js');
			var user = {
				local: {},
				facebook: {},
				google: {},
				activation: {}
			};

			var sanitizedUser = model.sanitize(user);
			assert.equal(sanitizedUser.local, undefined);
			assert.equal(sanitizedUser.facebook, undefined);
			assert.equal(sanitizedUser.google, undefined);
			assert.equal(sanitizedUser.activation, undefined);
			done();
		});
	});

	describe('#checkAvailability()', function(){
		it('should fail because username exists', function(done) {
			var user = { username: 'test-user', email: 'test-user@example.com' };
			var restfulMock = {
				model: function(){
					return {
						findOne: function(query, callback) { callback(undefined, user); },
						ensureIndexes: function() { }
					}
				}
			};

			mockery.registerMock('../libs/restful', restfulMock);
			
			var model = require('../../server/models/user.js');
			model.checkAvailability(user)
				.then(function (){
					done('Failed');
				})
				.catch(function (err){
					done();
				});
		});
  
		it('should NOT fail because username/email is available', function(done) {			
			var user = { username: 'test-user', email: 'test-user@example.com' };
			var restfulMock = {
				model: function(){
					return {
						findOne: function(query, callback) { callback(); },
						ensureIndexes: function() { }
					}
				}
			};
			mockery.registerMock('../libs/restful', restfulMock);
			
			var model = require('../../server/models/user.js');
			model.checkAvailability(user)
				.then(function (){
					done();
				})
				.catch(function (err){
					done(err);
				});
		});
	});

	describe('#isAdministrator()', function () {
		it('should return as an administrator', function(done){
			var model = require('../../server/models/user.js');
			assert.isOk(model.isAdministrator({ roles: ['administrator'] }));
			assert.isOk(model.isAdministrator({ roles: ['administrator', 'user'] }));
			done();
		});

		it('should not return as an administrator', function (done) {
			var model = require('../../server/models/user.js');
			assert.isNotOk(model.isAdministrator({ roles: ['user'] }));
			assert.isNotOk(model.isAdministrator({ roles: ['administratorx'] }));
			assert.isNotOk(model.isAdministrator());
			assert.isNotOk(model.isAdministrator({}));
			assert.isNotOk(model.isAdministrator({ roles: [] }));
			done();
		});
	});

	describe('#userQuery()', function() {
		it('should return an UserQuery object', function (done){
			var model = require('../../server/models/user.js');
			var result = model.userQuery('username');
			assert.equal(result.$or[0].email, 'username');
			assert.equal(result.$or[1].username, 'username');
			done();
		});
		it('should return an UserQuery object with undefiend email/username', function (done){
			var model = require('../../server/models/user.js');
			var result = model.userQuery();
			assert.isNull(result.$or[0].email);
			assert.isNull(result.$or[1].username);
			done();
		});
	});

	describe('#ensureAdminExists()', function() {
		it('should create an admin', function (done){
			function UserObj(){
				this.local = {};
				this.roles = [];
				this.generateHash = function (){ return "hash"; };
				this.save = function () { }
			}
			UserObj.ensureIndexes = function() { }
			UserObj.findOne = function(query, callback) { callback() }

			var user = { username: 'test-user', email: 'test-user@example.com' };
			var restfulMock = {
				model: function () {
					return UserObj;
				}
			};

			mockery.registerMock('../libs/restful', restfulMock);

			var XUser = restfulMock.model();
			var instance = new XUser();
			
			var model = require('../../server/models/user.js');

			model.ensureAdminExists().then((user) => {
				assert.equal('grafika', user.firstName);
				assert.equal(true, user.active);
				assert.equal('administrator', user.roles[0]);

				done();
			});
		});
	});

	describe('#randomUsername()', function(){
		it('should produce 100 random usernames', function (done) {
			var usernames = [];
			var model = require('../../server/models/user.js');
			for(var i = 0; i < 100; i++) {
				var username = model.randomUsername();
				for (var j = 0; j < usernames.length; j++){
					if (username === usernames[j])
						throw new Error('Not unique');
				}

				usernames.push(username);
			}

			done();
		});
	});
});