'use strict';

describe('Component: projectForm', function() {
  // load the component's module
  beforeEach(module('projectManagementApp.projects'));

  var projectFormComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    projectFormComponent = $componentController('projectForm', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
