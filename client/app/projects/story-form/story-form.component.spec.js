'use strict';

describe('Component: storyForm', function() {
  // load the component's module
  beforeEach(module('projectManagementApp.story-form'));

  var storyFormComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    storyFormComponent = $componentController('storyForm', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
