'use strict';
const angular = require('angular');

export class MockupFormComponent {
  /*@ngInject*/
  $onInit() {
    angular.extend(this, this.resolve);
  }

  save(form) {
    if(form.$valid) {
      Reflect.deleteProperty(this, 'imageError');
      if(!this.mockup._id && !this.mockup.file) {
        this.imageError = 'Image is required!';
        return;
      }
      if(!this.mockup.file) {
        return this.close({ $value: this.mockup });
      }
      var reader = new window.FileReader();
      reader.readAsDataURL(this.mockup.file);
      reader.onloadend = () => {
        this.mockup.image = reader.result;
        Reflect.deleteProperty(this.mockup, 'file');
        return this.close({ $value: this.mockup });
      };
      reader.onerror = () => {
        this.imageError = 'Unable to parse image.';
      };
    }
  }
}

export default angular.module('projectManagementApp.mockups.form', [])
  .component('mockupForm', {
    template: require('./mockup-form.component.html'),
    bindings: {
      resolve: '<',
      dismiss: '&',
      close: '&'
    },
    controller: MockupFormComponent,
    controllerAs: 'vm'
  })
  .name;
