'use strict'

angular.module('meteorApp')
.config(function($stateProvider) {
  $stateProvider
  .state('times', {
    url: '/times',
    templateUrl: 'client/times/times.view.ng.html',
    controller: 'TimesCtrl'
  });
});