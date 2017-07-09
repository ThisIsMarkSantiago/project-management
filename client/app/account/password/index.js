'use strict';

import angular from 'angular';
import PasswordController from './password.controller';

export default angular.module('projectManagementApp.password', [])
  .controller('PasswordController', PasswordController)
  .name;
