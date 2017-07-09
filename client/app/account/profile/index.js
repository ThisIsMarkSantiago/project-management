const angular = require('angular');

import ProfileComponent from './profile.component';

export default angular.module('projectManagementApp.profile', [])
  .component('profile', {
    template: require('./profile.html'),
    controller: ProfileComponent,
    controllerAs: 'vm'
  })
  .name;
