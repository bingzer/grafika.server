var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe("libs/ensure.ts", function (){
    describe("#notNullOrEmpty()", function (){
        it("should throw an error (null)", function (done){
            var model = require("../../server/libs/ensure.js");
            expect(model.notNullOrEmpty).to.throw(Error);
            expect(function () { model.notNullOrEmpty('') }).to.throw(Error);
            done();
        });

        it("should NOT throw an error (null)", function (done){
            var model = require("../../server/libs/ensure.js");
            expect(function() { model.notNullOrEmpty('string') }).to.not.throw(Error);
            done();
        });
    })
});