'use strict'

angular.module('meteorApp')
.controller('MainCtrl', function($scope, $meteor, $window) {
  var vm = $scope;
  vm.page = 1;
  vm.perPage = 3;
  vm.sort = {name_sort : 1};
  vm.orderProperty = '1';

  vm.things = $meteor.collection(function() {
    return Things.find({}, {sort:vm.getReactively('sort')});
  });
  $meteor.autorun(vm, function() {
    $meteor.subscribe('things', {
      limit: parseInt(vm.getReactively('perPage')),
      skip: parseInt((vm.getReactively('page') - 1) * vm.getReactively('perPage')),
      sort: vm.getReactively('sort')
    }, vm.getReactively('search')).then(function() {
      vm.thingsCount = $meteor.object(Counts, 'numberOfThings', false);
    });
  });

  vm.connectTrello = function() {
    //&oauth_token=f714c8ecc73c6689bfc67e9966c6afa9
    //$window.location.href = 'https://trello.com/1/authorize?key=6af5f1835de662abe13eaeca6258fbcb&name=Clocker&expiration=never&scope=read,account&response_type=token';
    //'https://trello.com/1/OAuthAuthorizeToken?name=Clocker&scope=read%2Caccount&expiration=never';
//console.log($meteor);
//console.log(Meteor);
    // Meteor.loginWithTrello({'type': 'redirect'}, function(token) {
    //   console.log(token);
    // });

    Meteor.call('connect', function(err, data) {
      if (err) {
        console.log(err);
      }

      console.log(data);
    });
  }

  vm.save = function() {
    if(vm.form.$valid) {
      vm.things.save(vm.newThing);
      vm.newThing = undefined;
    }
  };

  vm.remove = function(thing) {
    vm.things.remove(thing);
  };

  vm.pageChanged = function(newPage) {
    vm.page = newPage;
  };

  vm.$watch('orderProperty', function() {
    if(vm.orderProperty) {
      vm.sort = {name_sort: parseInt(vm.orderProperty)};
    }
  });
});