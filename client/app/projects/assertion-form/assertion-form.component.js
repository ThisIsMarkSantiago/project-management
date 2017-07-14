'use strict';
const angular = require('angular');

export class AssertionFormComponent {
  /*@ngInject*/
  $onInit() {
    angular.extend(this, this.resolve);
  }

  save(form) {
    if(form.$valid) {
      this.close({ $value: this.assertion });
    }
  }
}

export default angular.module('projectManagementApp.assertions.form', [])
  .component('assertionForm', {
    template: require('./assertion-form.component.html'),
    bindings: {
      resolve: '<',
      dismiss: '&',
      close: '&'
    },
    controller: AssertionFormComponent,
    controllerAs: 'vm'
  })
  .name;
