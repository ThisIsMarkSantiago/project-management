'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newEpic;

describe('Epic API:', function() {
  describe('GET /api/epics', function() {
    var epics;

    beforeEach(function(done) {
      request(app)
        .get('/api/epics')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          epics = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(epics).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/epics', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/epics')
        .send({
          name: 'New Epic',
          info: 'This is the brand new epic!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newEpic = res.body;
          done();
        });
    });

    it('should respond with the newly created epic', function() {
      expect(newEpic.name).to.equal('New Epic');
      expect(newEpic.info).to.equal('This is the brand new epic!!!');
    });
  });

  describe('GET /api/epics/:id', function() {
    var epic;

    beforeEach(function(done) {
      request(app)
        .get(`/api/epics/${newEpic._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          epic = res.body;
          done();
        });
    });

    afterEach(function() {
      epic = {};
    });

    it('should respond with the requested epic', function() {
      expect(epic.name).to.equal('New Epic');
      expect(epic.info).to.equal('This is the brand new epic!!!');
    });
  });

  describe('PUT /api/epics/:id', function() {
    var updatedEpic;

    beforeEach(function(done) {
      request(app)
        .put(`/api/epics/${newEpic._id}`)
        .send({
          name: 'Updated Epic',
          info: 'This is the updated epic!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedEpic = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedEpic = {};
    });

    it('should respond with the updated epic', function() {
      expect(updatedEpic.name).to.equal('Updated Epic');
      expect(updatedEpic.info).to.equal('This is the updated epic!!!');
    });

    it('should respond with the updated epic on a subsequent GET', function(done) {
      request(app)
        .get(`/api/epics/${newEpic._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let epic = res.body;

          expect(epic.name).to.equal('Updated Epic');
          expect(epic.info).to.equal('This is the updated epic!!!');

          done();
        });
    });
  });

  describe('PATCH /api/epics/:id', function() {
    var patchedEpic;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/epics/${newEpic._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Epic' },
          { op: 'replace', path: '/info', value: 'This is the patched epic!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedEpic = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedEpic = {};
    });

    it('should respond with the patched epic', function() {
      expect(patchedEpic.name).to.equal('Patched Epic');
      expect(patchedEpic.info).to.equal('This is the patched epic!!!');
    });
  });

  describe('DELETE /api/epics/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/epics/${newEpic._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when epic does not exist', function(done) {
      request(app)
        .delete(`/api/epics/${newEpic._id}`)
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
