'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newStory;

describe('Story API:', function() {
  describe('GET /api/stories', function() {
    var storys;

    beforeEach(function(done) {
      request(app)
        .get('/api/stories')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          storys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(storys).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/stories', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/stories')
        .send({
          name: 'New Story',
          info: 'This is the brand new story!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newStory = res.body;
          done();
        });
    });

    it('should respond with the newly created story', function() {
      expect(newStory.name).to.equal('New Story');
      expect(newStory.info).to.equal('This is the brand new story!!!');
    });
  });

  describe('GET /api/stories/:id', function() {
    var story;

    beforeEach(function(done) {
      request(app)
        .get(`/api/stories/${newStory._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          story = res.body;
          done();
        });
    });

    afterEach(function() {
      story = {};
    });

    it('should respond with the requested story', function() {
      expect(story.name).to.equal('New Story');
      expect(story.info).to.equal('This is the brand new story!!!');
    });
  });

  describe('PUT /api/stories/:id', function() {
    var updatedStory;

    beforeEach(function(done) {
      request(app)
        .put(`/api/stories/${newStory._id}`)
        .send({
          name: 'Updated Story',
          info: 'This is the updated story!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedStory = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStory = {};
    });

    it('should respond with the updated story', function() {
      expect(updatedStory.name).to.equal('Updated Story');
      expect(updatedStory.info).to.equal('This is the updated story!!!');
    });

    it('should respond with the updated story on a subsequent GET', function(done) {
      request(app)
        .get(`/api/stories/${newStory._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let story = res.body;

          expect(story.name).to.equal('Updated Story');
          expect(story.info).to.equal('This is the updated story!!!');

          done();
        });
    });
  });

  describe('PATCH /api/stories/:id', function() {
    var patchedStory;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/stories/${newStory._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Story' },
          { op: 'replace', path: '/info', value: 'This is the patched story!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedStory = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedStory = {};
    });

    it('should respond with the patched story', function() {
      expect(patchedStory.name).to.equal('Patched Story');
      expect(patchedStory.info).to.equal('This is the patched story!!!');
    });
  });

  describe('DELETE /api/stories/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/stories/${newStory._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when story does not exist', function(done) {
      request(app)
        .delete(`/api/stories/${newStory._id}`)
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
