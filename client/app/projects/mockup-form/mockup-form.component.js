'use strict';
const angular = require('angular');

export class MockupFormComponent {
  /*@ngInject*/
  $onInit() {
    angular.extend(this, this.resolve);
  }

  save(form) {
    if(form.$valid) {
      if(!this.mockup.file) {
        this.imageError = 'Image is required!';
        return;
      }
      var reader = new window.FileReader();
      reader.readAsDataURL(this.mockup.file);
      reader.onloadend = () => {
        this.mockup.image = reader.result;
        delete this.mockup.file;
        return this.close({ $value: this.mockup });
      }
      reader.onerror = () => {
        this.imageError = 'Unable to parse image.';
      };
    }
  }
}

export default angular.module('mockupsApp.mockups.form', [])
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
