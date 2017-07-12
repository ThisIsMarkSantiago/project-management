'use strict';
const angular = require('angular');

import epicForm from '../epic-form/epic-form.component';
import storyForm from '../story-form/story-form.component';
import assertionForm from '../assertion-form/assertion-form.component';

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
      })
      .catch(() => this.$state.go('projects'));

    this.deleteEpic = this.Modal.confirm.delete((epic, project) => {
      this.$http
        .delete(`/api/epics/${epic._id}`)
        .then(() => {
          this.Modal.alert.success()('Epic successfully deleted!');
          project.epics.splice(project.epics.indexOf(epic), 1);
        })
        .catch(() => this.Modal.alert.error()('An error occured deleting the epic!'));
    });

    this.deleteStory = this.Modal.confirm.delete((story, epic) => {
      this.$http
        .delete(`/api/stories/${story._id}`)
        .then(() => {
          this.Modal.alert.success()('Epic successfully deleted!');
          epic.stories.splice(epic.stories.indexOf(story), 1);
        })
        .catch(() => this.Modal.alert.error()('An error occured deleting the story!'));
    });

    this.deleteAssertion = this.Modal.confirm.delete((assertion, story) => {
      this.$http
        .delete(`/api/assertions/${assertion._id}`)
        .then(() => {
          this.Modal.alert.success()('Epic successfully deleted!');
          story.assertions.splice(story.assertions.indexOf(assertion), 1);
        })
        .catch(() => this.Modal.alert.error()('An error occured deleting the story!'));
    });
  }

  getEpics(project, collapased) {
    if(!collapased) {
      this.$http.get(`/api/projects/${project._id}/epics`)
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

  getStories(epic, collapased) {
    if(!collapased) {
      this.$http.get(`/api/epics/${epic._id}/stories`)
        .then(result => epic.stories = result.data);
    }
  }

  openStoryForm(epic, story, viewMode) {
    const modalInstance = this.$uibModal
      .open({
        component: 'storyForm',
        resolve: {
          story: () => angular.copy(story, {}),
          epic: () => angular.copy(epic, {}),
          viewMode
        }
      });

    modalInstance
      .result
      .then(result => {
        this.$http[result._id ? 'patch' : 'post'](
            `/api/stories/${result._id || ''}`,
            result._id ? [
              { op: 'replace', path: '/name', value: result.name },
              { op: 'replace', path: '/info', value: result.info }
            ] : result
          )
          .then(response => {
            this.Modal.alert.success()(`Story successfully ${result._id ? 'upd' : 'cre'}ated!`);
            if(result._id) {
              epic.stories[epic.stories.indexOf(story)] = response.data;
            } else {
              epic.stories.push(response.data);
            }
          })
          .catch(() => this.Modal.alert.error()(`An error occured ${result._id ? 'upd' : 'cre'}ating the story!`));
      });
  }

  getAssertions(story, collapased) {
    if(!collapased) {
      this.$http.get(`/api/stories/${story._id}/assertions`)
        .then(result => story.assertions = result.data);
    }
  }

  openAssertionForm(epic, story, assertion, viewMode) {
    const modalInstance = this.$uibModal
      .open({
        component: 'assertionForm',
        resolve: {
          assertion: () => angular.copy(assertion, {}),
          epic: () => angular.copy(epic, {}),
          story: () => angular.copy(story, {}),
          viewMode
        }
      });

    modalInstance
      .result
      .then(result => {
        this.$http[result._id ? 'patch' : 'post'](
            `/api/assertions/${result._id || ''}`,
            result._id ? [
              { op: 'replace', path: '/info', value: result.info }
            ] : result
          )
          .then(response => {
            this.Modal.alert.success()(`Assertion successfully ${result._id ? 'upd' : 'cre'}ated!`);
            if(result._id) {
              story.assertions[story.assertions.indexOf(assertion)] = response.data;
            } else {
              story.assertions.push(response.data);
            }
          })
          .catch(() => this.Modal.alert.error()(`An error occured ${result._id ? 'upd' : 'cre'}ating the assertion!`));
      });
  }
}

export default angular.module('projectManagementApp.projects.details', [epicForm, storyForm, assertionForm])
  .component('projectDetails', {
    template: require('./project-details.component.html'),
    controller: projectDetailsComponent,
    controllerAs: 'vm'
  })
  .name;
