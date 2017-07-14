'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newInteraction;

describe('Interaction API:', function() {
  describe('GET /api/interactions', function() {
    var interactions;

    beforeEach(function(done) {
      request(app)
        .get('/api/interactions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          interactions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(interactions).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/interactions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/interactions')
        .send({
          name: 'New Interaction',
          info: 'This is the brand new interaction!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newInteraction = res.body;
          done();
        });
    });

    it('should respond with the newly created interaction', function() {
      expect(newInteraction.name).to.equal('New Interaction');
      expect(newInteraction.info).to.equal('This is the brand new interaction!!!');
    });
  });

  describe('GET /api/interactions/:id', function() {
    var interaction;

    beforeEach(function(done) {
      request(app)
        .get(`/api/interactions/${newInteraction._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          interaction = res.body;
          done();
        });
    });

    afterEach(function() {
      interaction = {};
    });

    it('should respond with the requested interaction', function() {
      expect(interaction.name).to.equal('New Interaction');
      expect(interaction.info).to.equal('This is the brand new interaction!!!');
    });
  });

  describe('PUT /api/interactions/:id', function() {
    var updatedInteraction;

    beforeEach(function(done) {
      request(app)
        .put(`/api/interactions/${newInteraction._id}`)
        .send({
          name: 'Updated Interaction',
          info: 'This is the updated interaction!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedInteraction = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedInteraction = {};
    });

    it('should respond with the updated interaction', function() {
      expect(updatedInteraction.name).to.equal('Updated Interaction');
      expect(updatedInteraction.info).to.equal('This is the updated interaction!!!');
    });

    it('should respond with the updated interaction on a subsequent GET', function(done) {
      request(app)
        .get(`/api/interactions/${newInteraction._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let interaction = res.body;

          expect(interaction.name).to.equal('Updated Interaction');
          expect(interaction.info).to.equal('This is the updated interaction!!!');

          done();
        });
    });
  });

  describe('PATCH /api/interactions/:id', function() {
    var patchedInteraction;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/interactions/${newInteraction._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Interaction' },
          { op: 'replace', path: '/info', value: 'This is the patched interaction!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedInteraction = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedInteraction = {};
    });

    it('should respond with the patched interaction', function() {
      expect(patchedInteraction.name).to.equal('Patched Interaction');
      expect(patchedInteraction.info).to.equal('This is the patched interaction!!!');
    });
  });

  describe('DELETE /api/interactions/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/interactions/${newInteraction._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when interaction does not exist', function(done) {
      request(app)
        .delete(`/api/interactions/${newInteraction._id}`)
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
