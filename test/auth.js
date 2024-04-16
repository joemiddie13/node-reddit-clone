const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
const app = require('../server');
const User = require('../models/user');

const should = chai.should();

chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(app);

describe('User', function () {
  it('should be able to signup', function (done) {
    User.findOneAndRemove({ username: 'testone' }, function() {
      agent
        .post('/sign-up')
        .send({ username: 'testone', password: 'password' })
        .end(function (err, res) {
          console.log(res.body);
          res.should.have.status(200);
          agent.should.have.cookie('nToken');
          done();
        });
    });
  });

  it('should be able to login', function (done) {
    agent
      .post('/login')
      .send({ username: 'testone', password: 'password' })
      .end(function (err, res) {
        res.should.have.status(200);
        agent.should.have.cookie('nToken');
        done();
      });
  });

  it('should be able to logout', function (done) {
    agent.get('/logout').end(function (err, res) {
      res.should.have.status(200);
      agent.should.not.have.cookie('nToken');
      done();
    });
  });
  after(function () {
    agent.close();
  });
});