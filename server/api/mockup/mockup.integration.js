'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newMockup;

describe('Mockup API:', function() {
  describe('GET /api/mockups', function() {
    var mockups;

    beforeEach(function(done) {
      request(app)
        .get('/api/mockups')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          mockups = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(mockups).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/mockups', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/mockups')
        .send({
          name: 'New Mockup',
          info: 'This is the brand new mockup!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newMockup = res.body;
          done();
        });
    });

    it('should respond with the newly created mockup', function() {
      expect(newMockup.name).to.equal('New Mockup');
      expect(newMockup.info).to.equal('This is the brand new mockup!!!');
    });
  });

  describe('GET /api/mockups/:id', function() {
    var mockup;

    beforeEach(function(done) {
      request(app)
        .get(`/api/mockups/${newMockup._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          mockup = res.body;
          done();
        });
    });

    afterEach(function() {
      mockup = {};
    });

    it('should respond with the requested mockup', function() {
      expect(mockup.name).to.equal('New Mockup');
      expect(mockup.info).to.equal('This is the brand new mockup!!!');
    });
  });

  describe('PUT /api/mockups/:id', function() {
    var updatedMockup;

    beforeEach(function(done) {
      request(app)
        .put(`/api/mockups/${newMockup._id}`)
        .send({
          name: 'Updated Mockup',
          info: 'This is the updated mockup!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedMockup = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMockup = {};
    });

    it('should respond with the updated mockup', function() {
      expect(updatedMockup.name).to.equal('Updated Mockup');
      expect(updatedMockup.info).to.equal('This is the updated mockup!!!');
    });

    it('should respond with the updated mockup on a subsequent GET', function(done) {
      request(app)
        .get(`/api/mockups/${newMockup._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let mockup = res.body;

          expect(mockup.name).to.equal('Updated Mockup');
          expect(mockup.info).to.equal('This is the updated mockup!!!');

          done();
        });
    });
  });

  describe('PATCH /api/mockups/:id', function() {
    var patchedMockup;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/mockups/${newMockup._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Mockup' },
          { op: 'replace', path: '/info', value: 'This is the patched mockup!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedMockup = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedMockup = {};
    });

    it('should respond with the patched mockup', function() {
      expect(patchedMockup.name).to.equal('Patched Mockup');
      expect(patchedMockup.info).to.equal('This is the patched mockup!!!');
    });
  });

  describe('DELETE /api/mockups/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/mockups/${newMockup._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when mockup does not exist', function(done) {
      request(app)
        .delete(`/api/mockups/${newMockup._id}`)
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
