'use strict';
const angular = require('angular');

export class InteractionFormComponent {
  actions = [
    'onClick',
    'onHover',
    'onSelected'
  ];
  /*@ngInject*/
  $onInit() {
    angular.extend(this, this.resolve);
  }

  save(form) {
    if(form.$valid) {
      this.close({ $value: this.interaction });
    }
  }
}

export default angular.module('projectManagementApp.interactions.form', [])
  .component('interactionForm', {
    template: require('./interaction-form.component.html'),
    bindings: {
      resolve: '<',
      dismiss: '&',
      close: '&'
    },
    controller: InteractionFormComponent,
    controllerAs: 'vm'
  })
  .name;
