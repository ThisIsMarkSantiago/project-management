'use strict';
const angular = require('angular');

export class StoryFormComponent {
  /*@ngInject*/
  $onInit() {
    this.story = this.resolve.story;
    this.epic = this.resolve.epic;
    this.viewMode = this.resolve.viewMode;
  }

  save(form) {
    if(form.$valid) {
      this.close({ $value: this.story });
    }
  }
}

export default angular.module('storysApp.storys.form', [])
  .component('storyForm', {
    template: require('./story-form.component.html'),
    bindings: {
      resolve: '<',
      dismiss: '&',
      close: '&'
    },
    controller: StoryFormComponent,
    controllerAs: 'vm'
  })
  .name;
