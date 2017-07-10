'use strict';

describe('Component: projectDetails', function() {
  // load the component's module
  beforeEach(module('projectManagementApp.projects'));

  var projectDetailsComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    projectDetailsComponent = $componentController('projectDetails', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
