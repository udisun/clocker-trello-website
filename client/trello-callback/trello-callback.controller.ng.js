'use strict'

angular.module('meteorApp')
.controller('TrelloCallBackCtrl', function($scope, $window, $location) {
  var vm = $scope;
  vm.viewName = 'TrelloCallBack';

  console.log('controller');

  var loaderFinish = function(time) {
    if (!time) {
      time = 0;
    }
    Meteor.setTimeout(function() {
      $('.pg-loading-screen').fadeOut();
    }, time);
  }

  var locationSearch = $location.search();
  if (locationSearch.hasOwnProperty('oauth_token') && _.isString(locationSearch.oauth_token)) {
    Meteor.call('trelloAccessToken', locationSearch.oauth_token, locationSearch.oauth_verifier, function(err, data) {
      console.log('data', data);

      if (!data) {
        console.log('redirect');
        $window.location.href = Meteor.absoluteUrl('');
      }
      else {
        /**** Get the trello data here ****/

        // Get trello ME
        Meteor.call('trelloGetMe', function(err, data) {
          console.log(err, data);
        });
      }

      //loaderFinish(3000);
    });
  }
  else {
    $window.location.href = Meteor.absoluteUrl('');
  }
});