'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('projects', {
      url: '/projects',
      template: '<projects></projects>',
      authenticate: true
    })
    .state('project-details', {
      url: '/projects/:id',
      template: '<project-details></project-details>',
      authenticate: true
    });
}
