process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var server = require('../index.js');
//var Blob = require("../server/models/blob");

var should = chai.should();
chai.use(chaiHttp);

describe('Animations', function () {
  it('should list ALL animations on /Animations GET', function(done) {
    chai.request(server)
      .get('/api/animations')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });

  it('should not create animation on /Animations POST', function(done) {
    chai.request(server)
      .post('/api/animations')
      .end(function(err, res){
        res.should.have.status(401);
        done();
      });
  });

  
})