'use strict';

describe('Component: assertionForm', function() {
  // load the component's module
  beforeEach(module('projectManagementApp.assertion-form'));

  var assertionFormComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    assertionFormComponent = $componentController('assertionForm', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
