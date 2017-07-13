'use strict';

describe('Component: mockupForm', function() {
  // load the component's module
  beforeEach(module('projectManagementApp.mockup-form'));

  var mockupFormComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    mockupFormComponent = $componentController('mockupForm', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
