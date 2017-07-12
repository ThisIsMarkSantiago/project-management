'use strict';

describe('Component: epicForm', function() {
  // load the component's module
  beforeEach(module('projectManagementApp.epic-form'));

  var epicFormComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    epicFormComponent = $componentController('epicForm', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
