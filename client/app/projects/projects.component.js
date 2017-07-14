'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './projects.routes';
import ModalService from '../../components/modal/modal.service';
import form from './project-form/project-form.component';
import details from './project-details/project-details.component';

export class ProjectsComponent {
  projects = [];

  /*@ngInject*/
  constructor($uibModal, Modal, $http, Auth) {
    angular.extend(this, {
      $http,
      $uibModal,
      Modal,
      Auth
    });
  }

  $onInit() {
    this.Auth.getCurrentUser().then(user => {
      this.user = user;
      this.getProjects();
      this.deleteProject = this.Modal.confirm.delete(project => {
        this.$http
          .delete(`/api/projects/${project._id}`)
          .then(() => {
            this.Modal.alert.success()('Project successfully deleted!');
            this.getProjects();
          })
          .catch(() => this.Modal.alert.error()('An error occured deleting the project!'));
      });
    });
  }

  getProjects() {
    return this.$http.get(`/api/users/${this.user._id}/projects`)
      .then(response => {
        this.projects = response.data;
      });
  }

  openProjectForm(project) {
    const modalInstance = this.$uibModal
      .open({
        component: 'projectForm',
        resolve: {
          project: () => angular.copy(project, {})
        }
      });

    modalInstance
      .result
      .then(result => {
        this.$http[result._id ? 'patch' : 'post'](
            `/api/projects/${result._id || ''}`,
            result._id ? [
              { op: 'replace', path: '/name', value: result.name },
              { op: 'replace', path: '/info', value: result.info }
            ] : result
          )
          .then(() => {
            this.Modal.alert.success()(`Project successfully ${result._id ? 'upd' : 'cre'}ated!`);
            this.getProjects();
          })
          .catch(() => this.Modal.alert.error()(`An error occured ${result._id ? 'upd' : 'cre'}ating the project!`));
      });
  }
}

export default angular.module('projectManagementApp.projects', [uiRouter, form, details, ModalService])
  .config(routes)
  .component('projects', {
    template: require('./projects.html'),
    controller: ProjectsComponent,
    controllerAs: 'vm'
  })
  .name;
