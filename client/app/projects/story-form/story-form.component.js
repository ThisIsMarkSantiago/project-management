'use strict';
const angular = require('angular');

export class StoryFormComponent {
  /*@ngInject*/
  $onInit() {
    angular.extend(this, this.resolve);
  }

  save(form) {
    if(form.$valid) {
      this.close({ $value: this.story });
    }
  }
}

export default angular.module('projectManagementApp.storys.form', [])
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
