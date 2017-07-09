'use strict';

export default class ProfileComponent {
  updateMode = false;
  profile;
  errors;

  /*@ngInject*/
  constructor($http, socket, Modal) {
    this.$http = $http;
    this.socket = socket;
    this.Modal = Modal;
  }

  $onInit() {
    this.$http.get('/api/users/me')
      .then(response => {
        this.profile = response.data;
        this.user = {
          name: this.profile.name,
          email: this.profile.email
        };
      });
  }

  submit(form) {
    if(form.$valid) {
      this.$http.put(`/api/users/${this.profile._id}`, this.user)
        .then(response => {
          this.user = response.data;
          this.profile = response.data;
          this.Modal.alert.success()('User profile successfully updated!');
        })
        .catch(err => {
          this.errors.profile = err.message;
        });
    }
  }
}
