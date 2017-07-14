'use strict';
const angular = require('angular');

import epicForm from '../epic-form/epic-form.component';
import storyForm from '../story-form/story-form.component';
import assertionForm from '../assertion-form/assertion-form.component';
import mockupForm from '../mockup-form/mockup-form.component';
import interactionForm from '../interaction-form/interaction-form.component';

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

    const generateDeleteMethod = (model, pluralModel, successText) => {
      return this.Modal.confirm.delete((entity, parent) => {
        this.$http
          .delete(`/api/${pluralModel}/${entity._id}`)
          .then(() => {
            this.Modal.alert.success()(successText);
            parent[pluralModel].splice(parent[pluralModel].indexOf(entity), 1);
          })
          .catch(() => this.Modal.alert.error()(`An error occured deleting the ${model}!`));
      });
    };

    this.deleteEpic = generateDeleteMethod('epic', 'epics', 'Epic successfully deleted!');
    this.deleteStory = generateDeleteMethod('story', 'stories', 'Story successfully deleted!');
    this.deleteAssertion = generateDeleteMethod('assertion', 'assertions', 'Assertion successfully deleted!');
    this.deleteMockup = generateDeleteMethod('mockup', 'mockups', 'Mockup successfully deleted!');
    this.deleteInteraction = generateDeleteMethod('interaction', 'interactions', 'Interaction successfully deleted!');
  }

  getEpics(project, collapased) {
    if(!collapased) {
      this.$http.get(`/api/projects/${project._id}/epics`)
        .then(result => {
          project.epics = result.data;
          return result.data;
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
            if(project.epics) {
              if(result._id) {
                project.epics[project.epics.indexOf(epic)] = response.data;
              } else {
                project.epics.push(response.data);
              }
            }
          })
          .catch(() => this.Modal.alert.error()(`An error occured ${result._id ? 'upd' : 'cre'}ating the epic!`));
      });
  }

  getStories(epic, collapased) {
    if(!collapased) {
      this.$http.get(`/api/epics/${epic._id}/stories`)
        .then(result => {
          epic.stories = result.data;
          return result.data;
        });
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
            if(epic.stories) {
              if(result._id) {
                epic.stories[epic.stories.indexOf(story)] = response.data;
              } else {
                epic.stories.push(response.data);
              }
            }
          })
          .catch(() => this.Modal.alert.error()(`An error occured ${result._id ? 'upd' : 'cre'}ating the story!`));
      });
  }

  getAssertions(story, collapased) {
    if(!collapased) {
      this.$http.get(`/api/stories/${story._id}/assertions`)
        .then(result => {
          story.assertions = result.data;
          return result.data;
        });
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
            if(story.assertions) {
              if(result._id) {
                story.assertions[story.assertions.indexOf(assertion)] = response.data;
              } else {
                story.assertions.push(response.data);
              }
            }
          })
          .catch(() => this.Modal.alert.error()(`An error occured ${result._id ? 'upd' : 'cre'}ating the assertion!`));
      });
  }

  getMockups(story, collapased) {
    if(!collapased) {
      this.$http.get(`/api/stories/${story._id}/mockups`)
        .then(result => {
          story.mockups = result.data;
          return result.data;
        });
    }
  }

  openMockupForm(epic, story, mockup, viewMode) {
    const modalInstance = this.$uibModal
      .open({
        component: 'mockupForm',
        resolve: {
          mockup: () => angular.copy(mockup, {}),
          epic: () => angular.copy(epic, {}),
          story: () => angular.copy(story, {}),
          viewMode
        }
      });

    modalInstance
      .result
      .then(result => {
        const updates = [
          { op: 'replace', path: '/url', value: result.url },
          { op: 'replace', path: '/raw', value: result.raw }
        ];
        if(result.image) {
          updates.push({ op: 'replace', path: '/image', value: result.image });
        }
        this.$http[result._id ? 'patch' : 'post'](
            `/api/mockups/${result._id || ''}`,
            !result._id ? result : updates
          )
          .then(response => {
            this.Modal.alert.success()(`Mockup successfully ${result._id ? 'upd' : 'cre'}ated!`);
            if(story.mockups) {
              if(result._id) {
                story.mockups[story.mockups.indexOf(mockup)] = response.data;
              } else {
                story.mockups.push(response.data);
              }
            }
          })
          .catch(() => this.Modal.alert.error()(`An error occured ${result._id ? 'upd' : 'cre'}ating the mockup!`));
      });
  }

  getInteractions(mockup, collapased) {
    if(!collapased) {
      this.$http.get(`/api/mockups/${mockup._id}/interactions`)
        .then(result => {
          mockup.interactions = result.data;
          return result.data;
        });
    }
  }

  openInteractionForm(epic, story, mockup, interaction, viewMode) {
    const modalInstance = this.$uibModal
      .open({
        component: 'interactionForm',
        resolve: {
          interaction: () => angular.copy(interaction, {}),
          epic: () => angular.copy(epic, {}),
          story: () => angular.copy(story, {}),
          mockup: () => angular.copy(mockup, {}),
          viewMode
        }
      });

    modalInstance
      .result
      .then(result => {
        this.$http[result._id ? 'patch' : 'post'](
            `/api/interactions/${result._id || ''}`,
            result._id ? [
              { op: 'replace', path: '/action', value: result.action },
              { op: 'replace', path: '/target', value: result.target },
              { op: 'replace', path: '/outcome', value: result.outcome }
            ] : result
          )
          .then(response => {
            this.Modal.alert.success()(`Interaction successfully ${result._id ? 'upd' : 'cre'}ated!`);
            if(mockup.interactions) {
              if(result._id) {
                mockup.interactions[mockup.interactions.indexOf(interaction)] = response.data;
              } else {
                mockup.interactions.push(response.data);
              }
            }
          })
          .catch(() => this.Modal.alert.error()(`An error occured ${result._id ? 'upd' : 'cre'}ating the mockup!`));
      });
  }
}

export default angular.module('projectManagementApp.projects.details', [
    epicForm,
    storyForm,
    assertionForm,
    mockupForm,
    interactionForm
  ])
  .component('projectDetails', {
    template: require('./project-details.component.html'),
    controller: projectDetailsComponent,
    controllerAs: 'vm'
  })
  .name;
