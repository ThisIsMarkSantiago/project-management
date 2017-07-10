'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var epicCtrlStub = {
  index: 'epicCtrl.index',
  show: 'epicCtrl.show',
  create: 'epicCtrl.create',
  upsert: 'epicCtrl.upsert',
  patch: 'epicCtrl.patch',
  destroy: 'epicCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var epicIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './epic.controller': epicCtrlStub
});

describe('Epic API Router:', function() {
  it('should return an express router instance', function() {
    expect(epicIndex).to.equal(routerStub);
  });

  describe('GET /api/epics', function() {
    it('should route to epic.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'epicCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/epics/:id', function() {
    it('should route to epic.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'epicCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/epics', function() {
    it('should route to epic.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'epicCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/epics/:id', function() {
    it('should route to epic.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'epicCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/epics/:id', function() {
    it('should route to epic.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'epicCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/epics/:id', function() {
    it('should route to epic.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'epicCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
