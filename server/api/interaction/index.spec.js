'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var interactionCtrlStub = {
  index: 'interactionCtrl.index',
  show: 'interactionCtrl.show',
  create: 'interactionCtrl.create',
  upsert: 'interactionCtrl.upsert',
  patch: 'interactionCtrl.patch',
  destroy: 'interactionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var interactionIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './interaction.controller': interactionCtrlStub
});

describe('Interaction API Router:', function() {
  it('should return an express router instance', function() {
    expect(interactionIndex).to.equal(routerStub);
  });

  describe('GET /api/interactions', function() {
    it('should route to interaction.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'interactionCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/interactions/:id', function() {
    it('should route to interaction.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'interactionCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/interactions', function() {
    it('should route to interaction.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'interactionCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/interactions/:id', function() {
    it('should route to interaction.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'interactionCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/interactions/:id', function() {
    it('should route to interaction.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'interactionCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/interactions/:id', function() {
    it('should route to interaction.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'interactionCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
