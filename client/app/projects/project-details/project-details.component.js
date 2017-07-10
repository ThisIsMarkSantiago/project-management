'use strict';
const angular = require('angular');

import epicForm from '../epic-form/epic-form.component';

export class projectDetailsComponent {
  project;
  tree = [];

  /*@ngInject*/
  constructor($state, $http, $uibModal, Modal) {
    angular.extend(this, {
      $state,
      $http,
      $uibModal,
      Modal
    });
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

    this.deleteEpic = this.Modal.confirm.delete((epic, project) => {
      this.$http
        .delete(`/api/epics/${epic._id}`)
        .then(() => {
          this.Modal.alert.success()('Epic successfully deleted!');
          project.epics.splice(project.epics.indexOf(epic), 1);
        })
        .catch(() => this.Modal.alert.error()('An error occured deleting the epic!'));
    });
  }

  getEpics(project, collapased) {
    if(!collapased) {
      this.$http.get(`/api/projects/${this.$state.params.id}/epics`)
        .then(result => {
          project.epics = result.data;
        });
    }
  }

  openEpicForm(project, epic, viewMode) {
    const modalInstance = this.$uibModal
      .open({
        component: 'epicForm',
        resolve: {
          epic: () => angular.copy(epic, {}),
          viewMode
        }
      });

    modalInstance
      .result
      .then(result => {
        this.$http[result._id ? 'patch' : 'post'](
            `/api/epics/${result._id || ''}`,
            result._id ? [
              { op: 'replace', path: '/name', value: result.name },
              { op: 'replace', path: '/info', value: result.info }
            ] : result
          )
          .then(response => {
            this.Modal.alert.success()(`Epic successfully ${result._id ? 'upd' : 'cre'}ated!`);
            if(result._id) {
              project.epics[project.epics.indexOf(epic)] = response.data;
            } else {
              project.epics.push(response.data);
            }
          })
          .catch(() => this.Modal.alert.error()(`An error occured ${result._id ? 'upd' : 'cre'}ating the epic!`));
      });
  }
}

export default angular.module('projectManagementApp.projects.details', [epicForm])
  .component('projectDetails', {
    template: require('./project-details.component.html'),
    controller: projectDetailsComponent,
    controllerAs: 'vm'
  })
  .name;
