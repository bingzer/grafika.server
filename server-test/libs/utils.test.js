var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe("libs/utils.ts", function (){
    describe("#safeParseInt()", function (){
        it("should parse an integer", function (done){
            var model = require("../../server/libs/utils.js");
            assert.equal(model.safeParseInt("1"), 1);
            assert.equal(model.safeParseInt("10"), 10);
            assert.equal(model.safeParseInt("10.5"), 10);
            done();
        });

        it("should NOT parse an integer and return a -1", function (done){
            var model = require("../../server/libs/utils.js");
            assert.equal(model.safeParseInt("ab"), -1);
            done();
        });
    });

    describe("#randomlyPick()", function(){
        it("should randomly pick from options", function(done){
            var model = require("../../server/libs/utils.js");
            var value = model.randomlyPick([1,2,3,4,5]);

            assert.isOk(value > 0 && value <= 5);
            done();
        });
    });
});