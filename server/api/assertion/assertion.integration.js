'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newAssertion;

describe('Assertion API:', function() {
  describe('GET /api/assertions', function() {
    var assertions;

    beforeEach(function(done) {
      request(app)
        .get('/api/assertions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          assertions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(assertions).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/assertions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/assertions')
        .send({
          name: 'New Assertion',
          info: 'This is the brand new assertion!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newAssertion = res.body;
          done();
        });
    });

    it('should respond with the newly created assertion', function() {
      expect(newAssertion.name).to.equal('New Assertion');
      expect(newAssertion.info).to.equal('This is the brand new assertion!!!');
    });
  });

  describe('GET /api/assertions/:id', function() {
    var assertion;

    beforeEach(function(done) {
      request(app)
        .get(`/api/assertions/${newAssertion._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          assertion = res.body;
          done();
        });
    });

    afterEach(function() {
      assertion = {};
    });

    it('should respond with the requested assertion', function() {
      expect(assertion.name).to.equal('New Assertion');
      expect(assertion.info).to.equal('This is the brand new assertion!!!');
    });
  });

  describe('PUT /api/assertions/:id', function() {
    var updatedAssertion;

    beforeEach(function(done) {
      request(app)
        .put(`/api/assertions/${newAssertion._id}`)
        .send({
          name: 'Updated Assertion',
          info: 'This is the updated assertion!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedAssertion = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAssertion = {};
    });

    it('should respond with the updated assertion', function() {
      expect(updatedAssertion.name).to.equal('Updated Assertion');
      expect(updatedAssertion.info).to.equal('This is the updated assertion!!!');
    });

    it('should respond with the updated assertion on a subsequent GET', function(done) {
      request(app)
        .get(`/api/assertions/${newAssertion._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let assertion = res.body;

          expect(assertion.name).to.equal('Updated Assertion');
          expect(assertion.info).to.equal('This is the updated assertion!!!');

          done();
        });
    });
  });

  describe('PATCH /api/assertions/:id', function() {
    var patchedAssertion;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/assertions/${newAssertion._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Assertion' },
          { op: 'replace', path: '/info', value: 'This is the patched assertion!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedAssertion = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedAssertion = {};
    });

    it('should respond with the patched assertion', function() {
      expect(patchedAssertion.name).to.equal('Patched Assertion');
      expect(patchedAssertion.info).to.equal('This is the patched assertion!!!');
    });
  });

  describe('DELETE /api/assertions/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/assertions/${newAssertion._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when assertion does not exist', function(done) {
      request(app)
        .delete(`/api/assertions/${newAssertion._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
