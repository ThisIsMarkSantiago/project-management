'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var assertionCtrlStub = {
  index: 'assertionCtrl.index',
  show: 'assertionCtrl.show',
  create: 'assertionCtrl.create',
  upsert: 'assertionCtrl.upsert',
  patch: 'assertionCtrl.patch',
  destroy: 'assertionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var assertionIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './assertion.controller': assertionCtrlStub
});

describe('Assertion API Router:', function() {
  it('should return an express router instance', function() {
    expect(assertionIndex).to.equal(routerStub);
  });

  describe('GET /api/assertions', function() {
    it('should route to assertion.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'assertionCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/assertions/:id', function() {
    it('should route to assertion.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'assertionCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/assertions', function() {
    it('should route to assertion.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'assertionCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/assertions/:id', function() {
    it('should route to assertion.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'assertionCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/assertions/:id', function() {
    it('should route to assertion.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'assertionCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/assertions/:id', function() {
    it('should route to assertion.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'assertionCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
