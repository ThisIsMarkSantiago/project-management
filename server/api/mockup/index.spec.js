'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var mockupCtrlStub = {
  index: 'mockupCtrl.index',
  show: 'mockupCtrl.show',
  create: 'mockupCtrl.create',
  upsert: 'mockupCtrl.upsert',
  patch: 'mockupCtrl.patch',
  destroy: 'mockupCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var mockupIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './mockup.controller': mockupCtrlStub
});

describe('Mockup API Router:', function() {
  it('should return an express router instance', function() {
    expect(mockupIndex).to.equal(routerStub);
  });

  describe('GET /api/mockups', function() {
    it('should route to mockup.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'mockupCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/mockups/:id', function() {
    it('should route to mockup.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'mockupCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/mockups', function() {
    it('should route to mockup.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'mockupCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/mockups/:id', function() {
    it('should route to mockup.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'mockupCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/mockups/:id', function() {
    it('should route to mockup.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'mockupCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/mockups/:id', function() {
    it('should route to mockup.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'mockupCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
