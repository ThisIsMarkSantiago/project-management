'use strict';
const angular = require('angular');

export class ProjectFormComponent {
  /*@ngInject*/
  $onInit() {
    this.project = this.resolve.project;
  }

  save(form) {
    if(form.$valid) {
      this.close({ $value: this.project });
    }
  }
}

export default angular.module('projectsApp.projects.form', [])
  .component('projectForm', {
    template: require('./project-form.component.html'),
    bindings: {
      resolve: '<',
      dismiss: '&',
      close: '&'
    },
    controller: ProjectFormComponent,
    controllerAs: 'vm'
  })
  .name;
