'use strict'

angular.module('meteorApp')
.controller('TrelloCallBackCtrl', function($scope) {
  $scope.viewName = 'TrelloCallBack';




  console.log('controller');
  Meteor.call('trelloAccessToken', function(err, data) {
    if (err) {
      console.log(err);
    }

    console.log(data);
  });
});