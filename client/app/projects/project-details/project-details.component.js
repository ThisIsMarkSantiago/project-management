'use strict';
const angular = require('angular');

export class projectDetailsComponent {
  project;

  /*@ngInject*/
  constructor($state, $http) {
    this.$state = $state;
    this.$http = $http;
  }

  $onInit() {
    if(!this.$state.params.id) {
      return this.$state.go('projects');
    }
    this.$http.get(`/api/projects/${this.$state.params.id}`)
      .then(result => {
        this.project = result.data;
        if(!this.project) {
          return this.$state.go('projects');
        }
        this.projects = [this.project];
      });
  }
}

export default angular.module('projectManagementApp.projects.details', [])
  .component('projectDetails', {
    template: require('./project-details.component.html'),
    controller: projectDetailsComponent,
    controllerAs: 'vm'
  })
  .name;
