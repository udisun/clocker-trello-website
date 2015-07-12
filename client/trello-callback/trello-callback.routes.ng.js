'use strict'

angular.module('meteorApp')
.config(function($stateProvider) {
  $stateProvider
  .state('trelloCallBack', {
    url: '/trello-callback',
    templateUrl: 'client/trello-callback/trello-callback.view.ng.html',
    controller: 'TrelloCallBackCtrl'
  });
});