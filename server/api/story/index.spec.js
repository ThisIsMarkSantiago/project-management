'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var storyCtrlStub = {
  index: 'storyCtrl.index',
  show: 'storyCtrl.show',
  create: 'storyCtrl.create',
  upsert: 'storyCtrl.upsert',
  patch: 'storyCtrl.patch',
  destroy: 'storyCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var storyIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './story.controller': storyCtrlStub
});

describe('Story API Router:', function() {
  it('should return an express router instance', function() {
    expect(storyIndex).to.equal(routerStub);
  });

  describe('GET /api/stories', function() {
    it('should route to story.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'storyCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/stories/:id', function() {
    it('should route to story.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'storyCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/stories', function() {
    it('should route to story.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'storyCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/stories/:id', function() {
    it('should route to story.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'storyCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/stories/:id', function() {
    it('should route to story.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'storyCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/stories/:id', function() {
    it('should route to story.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'storyCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
