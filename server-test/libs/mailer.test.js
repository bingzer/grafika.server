var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe("libs/mailer.ts", function (){
	var mockery, mockConfig, mockFs, mockNodeMailer;

    ///////////////////////////////////////////////////////////////////////////

	beforeEach(function (){
		mockery = require('mockery');
		mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
        mockery.registerMock('winston', { error: function() {}, info: function() {}}); // output nothing
        
        mockConfig = {
            setting: {
                $server: {
                    $url: 'url',
                    $mailService: 'mailService',
                    $mailSmtp: 'mailSmtp',
                    $mailPort: 123,
                    $mailUser: 'mailUser',
                    $mailPassword: 'mailPassword'
                }   
            }
        };
        mockFs = {
            readFile: function (name, encoding, callback) {
                callback(undefined, name);
            }
        };
        mockNodeMailer = {
            mailer: {
                sendMail: function(){
                    throw Error('Not implemented');
                }
            },
            createTransport: function(){
                return mockNodeMailer.mailer;
            }
        };
	});

	afterEach(function (){
		mockery.deregisterAll();
        mockNodeMailer.mailer = {};
	});

    ///////////////////////////////////////////////////////////////////////////

    describe("#sendVerificationEmail()", function (){
        it("should successfully send verification email", function (done){
            mockNodeMailer.mailer = {
                sendMail: function(mailOptions, callback) {
                    callback(undefined, { response: 'good'});
                }
            }
            mockFs.readFile = function (name, encoding, callback) {
                assert.ok(name.includes("verification-template"));
                callback(undefined, name);
            };

            mockery.registerMock('../configs/config', mockConfig);
            mockery.registerMock('fs-extra', mockFs);
            mockery.registerMock('nodemailer', mockNodeMailer);

            var model = require("../../server/libs/mailer.js");
            var user = {
                _id: 'id',
                email: 'user@email',
                activation: {
                    hash: 'activation-hash'
                }
            }

            model.sendVerificationEmail(user).then(function () {
                done();
            });
        });
        
        it("should faild when sending email (i.e: Network error)", function (done){
            mockNodeMailer.mailer = {
                sendMail: function(mailOptions, callback) {
                    callback('Purposedly failed');
                }
            }
            mockFs.readFile = function (name, encoding, callback) {
                assert.ok(name.includes("verification-template"));
                callback(undefined, name);
            };

            mockery.registerMock('../configs/config', mockConfig);
            mockery.registerMock('fs-extra', mockFs);
            mockery.registerMock('nodemailer', mockNodeMailer);

            var model = require("../../server/libs/mailer.js");
            var user = {
                _id: 'id',
                email: 'user@email',
                activation: {
                    hash: 'activation-hash'
                }
            }

            model.sendVerificationEmail(user).catch(function () {
                done();
            });
        });
    });
    
    describe("#sendResetEmail()", function (){
        it("should successfully send verification email", function (done){
            mockNodeMailer.mailer = {
                sendMail: function(mailOptions, callback) {
                    callback(undefined, { response: 'good'});
                }
            };
            mockFs.readFile = function (name, encoding, callback) {
                assert.ok(name.includes("resetpwd-template"));
                callback(undefined, name);
            };

            mockery.registerMock('../configs/config', mockConfig);
            mockery.registerMock('fs-extra', mockFs);
            mockery.registerMock('nodemailer', mockNodeMailer);

            var model = require("../../server/libs/mailer.js");
            var user = {
                _id: 'id',
                email: 'user@email',
                activation: {
                    hash: 'activation-hash'
                }
            }

            model.sendResetEmail(user).then(function () {
                done();
            });
        });
        
        it("should faild when sending email (i.e: Network error)", function (done){
            mockNodeMailer.mailer = {
                sendMail: function(mailOptions, callback) {
                    callback('Purposedly failed');
                }
            };
            mockFs.readFile = function (name, encoding, callback) {
                assert.ok(name.includes("resetpwd-template"));
                callback(undefined, name);
            };

            mockery.registerMock('../configs/config', mockConfig);
            mockery.registerMock('fs-extra', mockFs);
            mockery.registerMock('nodemailer', mockNodeMailer);

            var model = require("../../server/libs/mailer.js");
            var user = {
                _id: 'id',
                email: 'user@email',
                activation: {
                    hash: 'activation-hash'
                }
            }

            model.sendResetEmail(user).catch(function () {
                done();
            });
        });
    })
});