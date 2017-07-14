'use strict';

describe('Component: interactionForm', function() {
  // load the component's module
  beforeEach(module('projectManagementApp.interaction-form'));

  var interactionFormComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    interactionFormComponent = $componentController('interactionForm', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
